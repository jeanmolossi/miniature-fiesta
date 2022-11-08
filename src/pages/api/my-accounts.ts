import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import { Fetcher } from '@/data/helpers/fetcher';
import constants from '@/constants';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	const cookies = new Cookies(request, response)
	const authToken = cookies.get('access_token');

	if (!authToken)
		return response.status(401).json({ message: 'Missing authentication' })

	const { statusCode, data } = await Fetcher
		.baseURL(constants.API_BASE_URL)
		.setHeader('authorization', `basic ${encodeURIComponent(authToken)}`)
		.setBody(request.query || {})
		.get('/accounts')

	return response.status(statusCode).json(data)
}
