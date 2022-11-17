import { Account } from "domain/accounts/account";

export enum WalletType {
	"CASH" = "CASH",
	"CREDIT" = "CREDIT",
	"DEBIT" = "DEBIT",
}

export enum WalletBrand {
	'VISA' = 'VISA',
	'MASTER' = 'MASTER',
	'ELO' = 'ELO',
	'AMERICAN_EXPRESS' = 'AMERICAN_EXPRESS',
}

export interface Wallet {
	id: string;
	name: string;
	type: WalletType;
	brand?: WalletBrand;
	limit: null | number,
	readable_limit: null | string,
	account?: Account;
	_self: string;
}
