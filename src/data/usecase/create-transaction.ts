import { Transaction, TransactionType } from "domain/transactions/transaction"
import { makeHttpClient } from "../client/factory/http-client";

interface CreateTransactionPayload {
	reference: string;
	wallet_id: string;
	category_id: string;
	type: TransactionType;
	value: number;
}

export async function createTransaction(body: CreateTransactionPayload) {
	const { data } = await makeHttpClient()
		.post<Transaction>('/api/create-transaction', body)
	return data;
}
