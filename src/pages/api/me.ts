import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import { makeHttpClient } from "@/data/server/factory/http-client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	const cookies = new Cookies(request, response)

	const accessToken = cookies.get('access_token') ?? request.headers?.authorization;
	const refreshToken = cookies.get('refresh_token') ?? request.headers?.['x-refresh-token'];

	if (!accessToken && !refreshToken)
		return response.status(401).json({ message: 'Missing authentication' })

	const { statusCode, data } = await getMe({ accessToken, refreshToken })

	response.setHeader('Cache-Control', 'max-age=300')
	return response.status(statusCode).json(data)
}

async function getMe({ accessToken, refreshToken }) {
	const httpClient = makeHttpClient()

	const cookies = new Map<string, string>([])

	if (accessToken)
		cookies.set('access_token', `access_token=${accessToken}`)
	if (refreshToken)
		cookies.set('refresh_token', `refresh_token=${refreshToken}`)

	try {
		const { status, data, headers } = await httpClient.get('/auth/me', { cookies })

		return { isError: status > 399, statusCode: status, data, headers }
	} catch (e) {
		return { isError: true, statusCode: e.statusCode ?? 500, data: null, headers: null }
	}
}
