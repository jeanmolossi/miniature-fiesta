import { Login, Me } from "domain/users/login";
import { makeHttpClient } from "../client/factory/http-client";

export async function login(login: Login): Promise<Me> {
	const httpClient = makeHttpClient()
	const { data } = await httpClient.post<Me>('/api/login', login)
	return data
}
