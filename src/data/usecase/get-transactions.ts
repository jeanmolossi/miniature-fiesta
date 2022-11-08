import constants from "@/constants";
import { Meta } from "domain/misc/meta";
import { Transaction } from "domain/transactions/transaction";
import { cookies } from "next/headers";
import { Fetcher } from "../helpers/fetcher";

interface TransactionList {
	transactions: Transaction[]
	meta: Meta
}

export interface GetTransactionFilters {
	account?: string;
}

export async function getTransactions({ account }: GetTransactionFilters) {
	const options = {}

	if (account)
		Object.assign(options, {account})

	const { data, isError } = await Fetcher
		.baseURL(constants.API_BASE_URL)
		.applyCookies(cookies())
		.setBody({
			sort: 'created_at,desc',
			relations: 'category',
			...options
		})
		.get<TransactionList>('/transactions')

	if (isError)
		throw new Error(data as any)

	return data
}
