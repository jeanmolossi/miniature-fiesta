import { cookies } from "next/headers"
import { Account } from "domain/accounts/account"
import { Meta } from "domain/misc/meta"
import { makeHttpClient } from "../client/factory/http-client"

interface AccountList {
	accounts: Account[]
	meta: Meta
}

const httpClient = makeHttpClient()

export async function getMyAccounts() {
	try {
		const { data } = await httpClient.get<AccountList>(
			'/api/my-accounts',
			{ cookies: cookies() },
		)

		return data;
	} catch (e) {
		console.log(e.message)
		throw e
	}
}
