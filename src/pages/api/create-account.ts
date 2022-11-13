import constants from "@/constants";
import { Fetcher } from "@/data/helpers/fetcher";
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

export default async function handler(request: NextRequest, response: NextApiResponse) {
	if (request.method.toUpperCase() !== 'POST')
		return response.status(405).json(undefined)

	const { body, headers } = request

	const result = await Fetcher.baseURL(constants.API_BASE_URL)
		.applyHeaders(headers)
		.setBody(body)
		.post('/users')

	const { statusCode, data } = result;
	return response.status(statusCode).json(data)
}
