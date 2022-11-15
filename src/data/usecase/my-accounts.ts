import { cookies } from "next/headers"
import { Account } from "domain/accounts/account"
import { Meta } from "domain/misc/meta"
import { Fetcher } from "../helpers/fetcher"

interface AccountList {
	accounts: Account[]
	meta: Meta
}

export async function getMyAccounts() {
	const { data, isError } = await Fetcher
		.baseURL()
		.applyCookies(cookies())
		.get<AccountList>('/api/my-accounts')

	if (isError)
		throw new Error(data as any)

	return data
}
