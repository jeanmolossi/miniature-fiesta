import { makeHttpClient } from "../client/factory/http-client"

export async function refreshToken() {
	const httpClient = makeHttpClient()

	try {
		const { status } = await httpClient.post('/api/refresh_token')
		return status === 201
	} catch (e) {
		console.log(e.message)
		return false
	}
}
