import { NextRequest, NextResponse } from "next/server";

export default async function handler(request: NextRequest) {
	if (request.url.includes('/_next/static')) {
		return NextResponse.next()
	}

	console.log(request.url , 'Middleware call')
}
