import { cookies } from 'next/headers'
import { Me } from "domain/users/login";
import { Fetcher } from "../helpers/fetcher";

export async function getMe(): Promise<Me> {
	const result = await Fetcher
		.baseURL()
		.applyCookies(cookies())
		.get<Me>('/api/me')

	if (result.isError) return;

	return result.data
}
