import dbconnect from "@/app/lib/dbconnect";
import { JsonWebTokenError } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/app/models/user.model";

export async function POST(req) {
    const cookiesStore = await cookies();
    await dbconnect();

    let refreshToken = cookiesStore.get('refreshtoken');

    if (!refreshToken) {
        return NextResponse.json({
            status: 401,
            message: 'Unauthorized request!'
        }, { status: 401 })
    }

    refreshToken = refreshToken.value;
    
    try {
        const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(data._id);

        const new_accessToken = user.generateAccessToken();
        const new_refreshToken = user.generateRefreshToken();

        cookiesStore.set('refreshtoken', new_refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60
        })

        return NextResponse.json({
            status: 200,
            new_accessToken
        }, { status: 200 })
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized request!'
            }, { status: 401 })
        }
    }
}