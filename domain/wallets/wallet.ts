export interface Wallet {
	id: string;
	name: string;
	type: "CASH" | "CREDIT" | "DEBIT";
	brand?: 'VISA' | 'MASTER' | 'ELO' | 'AMERICAN_EXPRESS';
	limit: null | number,
	readable_limit: null | string,
	_self: string;
}
