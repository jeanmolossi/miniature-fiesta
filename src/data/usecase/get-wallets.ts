import { cookies } from "next/headers";
import constants from "@/constants";
import { Meta } from "domain/misc/meta";
import { Wallet } from "domain/wallets/wallet";
import { Fetcher } from "../helpers/fetcher";

interface WalletsList {
	payments: Wallet[];
	meta: Meta
}

export async function getWallets() {
	const options = {}

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
