import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    const cookiesStore = await cookies();

    try {
        cookiesStore.delete('refreshtoken');
        
        return NextResponse.json({
            status: 200,
            message: 'Logged out successfully!'
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Some error occurred!'
        }, { status: 500 })
    }
}