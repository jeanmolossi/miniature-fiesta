export interface Account {
	id: string;
	name: string;
	initial_amount: number;
	initial_amount_fmt: string,
	current_amount: number,
	current_amount_fmt: string,
	bank_id: number,
	bank_name: "Carteira",
	created_at: Date,
	updated_at: Date,
	_self: string;
}
