import { Category } from "domain/categories/category";

export interface Transaction {
	id: string;
	reference: string;
	value: number;
	value_fmt: string;
	type: 'INCOME' | 'EXPENSE',
	created_at: string;
	updated_at: string;
	category?: Category;
	_self: string;
}
