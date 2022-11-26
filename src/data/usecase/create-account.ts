import { CreateAccount, CreatedAccount } from "domain/users/create-account";
import { makeHttpClient } from "../client/factory/http-client";

export async function createAccount(accountData: CreateAccount): Promise<CreatedAccount> {
	const response = await makeHttpClient().post<CreatedAccount>('/api/create-account', accountData)
	return response.data
}
