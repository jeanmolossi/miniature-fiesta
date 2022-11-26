import 'reflect-metadata'

import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from "next";
import { addMinutes } from "@/data/helpers/add-minutes";
import { HttpError } from "@/data/helpers/fetcher";
import { makeHttpClient } from "@/data/server/factory/http-client";

const httpClient = makeHttpClient()

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	if (request.method.toUpperCase() !== 'POST')
		return response.status(405).json(undefined)

	const { body } = request

	const { status: statusCode, data, headers } = await httpClient.post('/auth/login', body)

	if (headers.has('access_token')) {
		const token = encodeURIComponent(headers.get('access_token'))
		const opts = { expires: addMinutes(new Date(), 15) }
		const optsRefresh = { expires: addMinutes(new Date(), 60*24*7) }
		const cookies = new Cookies(request, response)

		cookies.set('access_token', headers.get('access_token'), opts)
		cookies.set('refresh_token', headers.get('refresh_token'), optsRefresh)

		try {
			const { status: statusCode, data } = await httpClient.get('/auth/me', {
				headers: {
					'Authorization': `Basic ${token}`,
					'X-Refresh-Token': `${headers.get('refresh_token')}`
				},
				cookies: new Map([
					['access_token', `access_token=${token}`],
					['refresh_token', `refresh_token=${headers.get('refresh_token')}`]
				])
			})

			return response.status(statusCode).json(data)
		} catch (e) {
			if (e instanceof HttpError) {
				return response.status(e.statusCode).json(e.message)
			}

			if ('statusCode' in e) {
				return response.status(e.statusCode).json(e.message)
			}

			return response.status(500).json({ message: e.message ?? "Internal Server Error" })
		}
	}

	return response.status(statusCode).json(data)
}
