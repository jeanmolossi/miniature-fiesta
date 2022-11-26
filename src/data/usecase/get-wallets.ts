import constants from "@/constants";
import { cookies } from "next/headers";
import { Meta } from "domain/misc/meta";
import { Wallet } from "domain/wallets/wallet";
import { makeHttpClient } from "../server/factory/http-client";

interface WalletsList {
	payments: Wallet[];
	meta: Meta
}

interface GetWalletsFilters {
	fields?: string[],
	relations?: string[]
}

export async function getWallets({ relations, fields }: GetWalletsFilters) {
	const query = new URLSearchParams()

	if (relations) query.append('relations', relations.join(','))
	if (fields) query.append('fields', fields.join(','))
	query.append('sort', 'created_at,desc')

	const { data } = await makeHttpClient()
		.get<WalletsList>('/payments', {
			cookies: cookies(),
			query
		})

	return data
}
