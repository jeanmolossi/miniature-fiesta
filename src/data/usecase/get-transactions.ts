import { cookies } from "next/headers";
import { Meta } from "domain/misc/meta";
import { Transaction } from "domain/transactions/transaction";
import { makeHttpClient } from "../server/factory/http-client";

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
	wallet?: string;
}

export async function getTransactions({
	account,
	page = 1,
	per_page = 15,
	sort = 'created_at,desc',
	start_date,
	wallet
}: GetTransactionFilters) {
	const query = new URLSearchParams()

	if (account)
		query.append('account', account)

	if (start_date)
		query.append('start_date', start_date)

	if(wallet)
		query.append('wallet', wallet)

	query.append('relations', 'category')
	query.append('page', page.toString())
	query.append('per_page', per_page.toString())
	query.append('sort', sort)

	const { data } = await makeHttpClient()
		.get<TransactionList>('/transactions', {
			cookies: cookies(),
			query
		})
	return data
}
