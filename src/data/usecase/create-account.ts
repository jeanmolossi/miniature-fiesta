import { CreateAccount, CreatedAccount } from "domain/users/create-account";
import { Fetcher } from "../helpers/fetcher";

export async function createAccount(accountData: CreateAccount): Promise<CreatedAccount> {
	const response = await Fetcher
		.baseURL()
		.setBody(accountData)
		.post<CreatedAccount>(`/api/create-account`)

	if (response.isError) {
		throw new Error(response.data as any)
	}

	return response.data
}
