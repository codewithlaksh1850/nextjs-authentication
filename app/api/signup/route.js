import dbconnect from "@/app/lib/dbconnect";
import User from "@/app/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbconnect();
    const _jsonData = await req.json();
    let success = false;

    const { username, email, password, cpassword } = _jsonData;

    try {
        const findUserByUsernameOrEmail = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (findUserByUsernameOrEmail) {
            return NextResponse.json({
                status: 400,
                success,
                message: 'Username or email already taken!'
            }, { status: 400 })
        } else if (password !== cpassword) {
            return NextResponse.json({
                status: 400,
                success,
                message: 'Passwords do not match!'
            }, { status: 400 })
        } else {
            const user = await User.create({
                username,
                email,
                password
            });

            success = true;

            return NextResponse.json({
                status: 201,
                success,
                message: 'Username account created!'
            }, { status: 201 })
        }
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            status: 500,
            errors: error.errors
        }, { status: 500 })
    }
}
