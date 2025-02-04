import dbconnect from "@/app/lib/dbconnect";
import User from "@/app/models/user.model";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
    const cookiesStore = await cookies();
    await dbconnect();
    const _jsonData = await req.json();
    let success = false;

    const { identifier, password } = _jsonData;

    const usernameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/;
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    try {
        let user;

        if (usernameRegex.test(identifier)) {
            user = await User.findOne({ username: identifier });
        } else if (emailRegex.test(identifier)) {
            user = await User.findOne({ email: identifier });
        }

        if (user) {
            const result = await user.isPasswordCorrect(password);
            success = true;

            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            cookiesStore.set('refreshtoken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 30 * 24 * 60 * 60
            })

            if (result) {
                return NextResponse.json({
                    status: 200,
                    success,
                    message: 'Loggedin successfully!',
                    accessToken
                }, { status: 200 })
            } else {
                return NextResponse.json({
                    status: 400,
                    success,
                    message: 'Incorrect password!'
                }, { status: 400 })
            }
        } else {
            return NextResponse.json({
                status: 404,
                success,
                message: 'No such user exists!'
            }, { status: 404 })
        }
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            status: 500,
            errors: error.errors
        }, { status: 500 })
    }
}
