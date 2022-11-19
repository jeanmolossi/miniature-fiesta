import constants from "@/constants";
import { cookies } from "next/headers";
import { Meta } from "domain/misc/meta";
import { Wallet } from "domain/wallets/wallet";
import { Fetcher } from "../helpers/fetcher";

interface WalletsList {
	payments: Wallet[];
	meta: Meta
}

interface GetWalletsFilters {
	fields?: string[],
	relations?: string[]
}

export async function getWallets({ relations, fields }: GetWalletsFilters) {
	const options = {}

	if (relations) Object.assign(options, { relations })
	if (fields) Object.assign(options, { fields: fields.join(',') })

	const { data, isError } = await Fetcher
		.baseURL(constants.API_BASE_URL)
		.applyCookies(cookies())
		.setBody({
			sort: 'created_at,desc',
			...options
		})
		.get<WalletsList>('/payments')

	if (isError)
		throw new Error(data as any)

	return data
}
