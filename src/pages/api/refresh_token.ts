import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import { makeHttpClient } from "@/data/server/factory/http-client";

const httpClient = makeHttpClient()

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method.toUpperCase() !== 'POST')
		return response.status(405).json(undefined)

	const cookies = new Cookies(request, response)

	const accessToken = request.headers?.['authorization']?.replace(/basic\s*/i, '') ?? cookies.get('access_token')
	const refreshToken = request.headers?.['x-refresh-token'] ?? cookies.get('refresh_token')

	if (!accessToken && !refreshToken) {
		response.setHeader('Location', '/login')
		return response.status(401).send({})
	}

	const { headers } = await makeRefresh({ accessToken, refreshToken })

	if (!headers) {
		response.setHeader('Location', '/login')
		return response.status(401).send('')
	}

	const _newAccessToken = headers.get('access_token')
	const _newRefreshToken = headers.get('refresh_token')
	const _setCookies = headers.get('set-cookie')

	response.setHeader('set-cookie', _setCookies ?? [
		`access_token=${_newAccessToken}`,
		`refresh_token=${_newRefreshToken}`
	])

	response.setHeader('Location', '/dashboard')
	return response.status(201).send('')
}

async function makeRefresh({ accessToken, refreshToken }) {
	const headers = {}

	if (accessToken)
		Object.assign(headers, { authorization: `Basic ${accessToken}` })

	if (refreshToken)
		Object.assign(headers, { 'x-refresh-token': `${refreshToken}` })

	try {
		return await httpClient.post(
			'/auth/refresh_token',
			undefined,
			{ headers },
		)
	} catch (e) {
		return { headers: null }
	}

}
