import { NextRequest, NextResponse } from "next/server";

export default async function handler(request: NextRequest) {
	if (shouldByPass(request.url)) {
		return NextResponse.next()
	}

	console.log(request.url , 'Middleware call')
}

function shouldByPass(url: string): boolean {
	const routesToByPass = ['/_next/static']

	routesToByPass.forEach((routeToByPass) => {
		return url.includes(routeToByPass)
	})

	return false
}
