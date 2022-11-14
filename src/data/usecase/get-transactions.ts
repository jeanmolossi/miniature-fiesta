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
	page?: number;
	per_page?: number;
	sort?: string;
	start_date?: string;
}

export async function getTransactions({
	account,
	page = 1,
	per_page = 15,
	sort = 'created_at,desc',
	start_date
}: GetTransactionFilters) {
	const options = {}

	if (account)
		Object.assign(options, {account})

	if (start_date)
		Object.assign(options, {start_date})

	const { data, isError } = await Fetcher
		.baseURL(constants.API_BASE_URL)
		.applyCookies(cookies())
		.setBody({
			page,
			per_page,
			sort,
			relations: 'category',
			...options
		})
		.get<TransactionList>('/transactions')

	if (isError)
		throw new Error(data as any)

	return data
}
