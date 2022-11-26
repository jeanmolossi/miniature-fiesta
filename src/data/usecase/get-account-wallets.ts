import { cookies } from "next/headers";
import { Meta } from "domain/misc/meta";
import { Wallet } from "domain/wallets/wallet";
import { makeHttpClient } from "../server/factory/http-client";

interface WalletsList {
	payments: Wallet[];
	meta: Meta;
}

export interface GetAccountFilters {
	account?: string;
	relations?: string[];
}

export async function getAccountWallets({ account, relations }: GetAccountFilters) {
	const query = new URLSearchParams()

	if (account) query.append('account', account)
	if (relations) query.append('relations', relations.join(','))
	query.append('sort', 'created_at,desc')

	const { data } = await makeHttpClient()
		.get<WalletsList>('/payments', {
			query,
			cookies: cookies()
		})

	return data;
}
