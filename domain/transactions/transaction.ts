import { Category } from "domain/categories/category";
import { Wallet } from "domain/wallets/wallet";

export enum TransactionType {
	EXPENSE = 'EXPENSE',
	INCOME = 'INCOME'
}

export interface Transaction {
	id: string;
	reference: string;
	value: number;
	value_fmt: string;
	type: TransactionType,
	created_at: string;
	updated_at: string;
	category?: Category;
	wallet?: Wallet;
	_self: string;
}
