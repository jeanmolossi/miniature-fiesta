import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import { makeHttpClient } from '@/data/server/factory/http-client';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	const cookies = new Cookies(request, response)
	const authToken = cookies.get('access_token');
	const refreshToken = cookies.get('refresh_token');

	if (!authToken && !refreshToken)
		return response.status(401).json({ message: 'Missing authentication' })

	const { status: statusCode, data } = await makeHttpClient()
		.get('/accounts', {
			headers: {
				'Authorization': `Basic ${authToken}`
			}
		})

	return response.status(statusCode).json(data)
}
