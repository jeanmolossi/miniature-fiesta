import { Login, Me } from "domain/users/login";
import { Fetcher } from "../helpers/fetcher";

export async function login(login: Login): Promise<Me> {
	const result = await Fetcher
		.baseURL()
		.setBody(login)
		.post<Me>('/api/login')

	if (result.isError) {
		throw new Error(result.data as any)
	}

	return result.data
}
