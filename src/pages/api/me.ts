import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import constants from "@/constants";
import { Fetcher } from "@/data/helpers/fetcher";

export default async function handler(_request: NextApiRequest, response: NextApiResponse) {
	const cookies = new Cookies(_request, response)

	const accessToken = cookies.get('access_token') ?? _request.headers?.authorization;

	if (!accessToken)
		return response.status(401).json({ message: 'Missing authentication' })

	const { statusCode, data } = await Fetcher
		.baseURL(constants.API_BASE_URL)
		.setHeader('authorization', `basic ${accessToken}`)
		.get('/auth/me')

	response.setHeader('Cache-Control', 'max-age=300')
	return response.status(statusCode).json(data)
}
