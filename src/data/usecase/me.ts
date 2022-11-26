import { cookies, headers } from 'next/headers'
import { Me } from "domain/users/login";
import { makeHttpClient } from '../client/factory/http-client';

const httpClient = makeHttpClient()

export async function getMe(): Promise<Me> {
	try {
		const { data } = await httpClient.get<Me>(
			'/api/me',
			{
				cookies: cookies(),
				headers: getHeaders()
			},
		)

		return data;
	} catch (e) {
		console.log(e.message)
		return;
	}
}

function getHeaders() {
	const _headers = {}

	for (let [key, value] of headers().entries()) {
		if (key !== 'cookie')
			Object.assign(_headers, { [key]: value })
	}

	return _headers
}
