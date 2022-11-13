import constants from "@/constants"
import { Transaction, TransactionType } from "domain/transactions/transaction"
import { Fetcher } from "../helpers/fetcher"

interface CreateTransactionPayload {
	reference: string;
	wallet_id: string;
	category_id: string;
	type: TransactionType;
	value: number;
}

export async function createTransaction(body: CreateTransactionPayload) {
	const { isError, data } = await Fetcher
		.baseURL()
		.setBody(body)
		.post<Transaction>('/api/create-transaction')

	if (isError)
		throw new Error(data as any)

	return data;
}
