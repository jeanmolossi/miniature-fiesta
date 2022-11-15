import constants from "@/constants";
import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from "next";
import { addMinutes } from "@/data/helpers/add-minutes";
import { Fetcher } from "@/data/helpers/fetcher";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method.toUpperCase() !== 'POST')
		return response.status(405).json(undefined)

	const { body } = request

	const result = await Fetcher
		.baseURL(constants.API_BASE_URL)
		.setBody(body)
		.post('/auth/login')

	const { statusCode, data, headers } = result

	const cookies = new Cookies(request, response)

	if (headers.has('access_token')) {
		const token = encodeURIComponent(headers.get('access_token'))
		const opts = { expires: addMinutes(new Date(), 15) }

		cookies.set('access_token', headers.get('access_token'), opts)

		const loggedUser = await Fetcher
			.baseURL(constants.API_BASE_URL)
			.setHeader('Authorization', `Basic ${token}`)
			.get('/auth/me')

		if (loggedUser.isError)
			return response.status(loggedUser.statusCode).json(loggedUser.data)

		return response.status(statusCode).json(loggedUser.data)
	}

	return response.status(statusCode).json(data)
}
