import constants from "@/constants";
import { cookies } from "next/headers";
import { Meta } from "domain/misc/meta";
import { Wallet } from "domain/wallets/wallet";
import { Fetcher } from "../helpers/fetcher";

interface WalletsList {
	payments: Wallet[];
	meta: Meta;
}

export interface GetAccountFilters {
	account?: string;
	relations?: string[];
}

export async function getAccountWallets({ account, relations }: GetAccountFilters) {
	const options: Partial<GetAccountFilters> = {}

	if (account) Object.assign(options, { account })
	if (relations) Object.assign(options, { relations })

	const { data, isError } = await Fetcher
		.baseURL(constants.API_BASE_URL)
		.applyCookies(cookies())
		.setBody({
			sort: 'created_at,desc',
			...options,
		})
		.get<WalletsList>('/payments')

	if (isError)
		throw new Error(data as any)

	return data;
}
