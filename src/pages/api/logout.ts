import constants from "@/constants";
import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from "next";
import { Fetcher } from "@/data/helpers/fetcher";


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method.toUpperCase() !== 'POST')
		return response.status(405).json(undefined)

	const cookies = new Cookies(request, response)
	const authToken = cookies.get('access_token')

	if (authToken) {
		const opts = { expires: new Date(0) }
		cookies.set('access_token', null, opts)

		const result = await Fetcher
			.baseURL(constants.API_BASE_URL)
			.setHeader('authorization', `basic ${encodeURIComponent(authToken)}`)
			.post('/auth/logout')

		const { statusCode, data, isError } = result

		console.log({ statusCode, data, isError })

		return response.status(statusCode).json(data)
	}

	return response.status(304).json(null)
}
