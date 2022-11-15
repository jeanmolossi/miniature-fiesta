import { NextApiRequest, NextApiResponse } from "next";
import { Fetcher } from "@/data/helpers/fetcher";
import constants from "@/constants";
import Cookies from "cookies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method.toUpperCase() !== 'POST')
		return response.status(405).json(undefined)

	const cookies = new Cookies(request, response)
	const authToken = cookies.get('access_token')

	if (!authToken)
		return response.status(401).json({ message: 'Missing authentication' })

	const { body } = request

	const result = await Fetcher.baseURL(constants.API_BASE_URL)
		.setHeader('authorization', `Basic ${authToken}`)
		.setBody(body)
		.post('/payments')

	const { statusCode, data } = result;
	return response.status(statusCode).json(data)
}
