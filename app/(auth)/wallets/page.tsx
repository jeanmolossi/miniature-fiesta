import { getWallets } from "@/data/usecase/get-wallets"
import Heading from "@/presentation/components/heading"
import { Wallet } from "domain/wallets/wallet"

export default async function WalletsPage() {
	const { payments } = await getWallets()

	console.log({payments})

	const columns = Math.min(4, payments.length)

	return (
		<div className={`grid grid-cols-${columns} gap-4`}>
			{payments.length
				? (payments.map(WalletCard))
				: null}
		</div>
	)
}

const WalletCard = ({ id, name, readable_limit, brand }: Wallet) => {
	const limit = readable_limit ?? 'R$ 0,00'
	const _brand = brand ?? ''

	return (
		<div key={id} className="bg-white shadow-sm p-4 rounded-md">
			<Heading as="h5">{name}</Heading>
			<div className="grid grid-cols-2">
				<span className="">{limit}</span>
				<span className="text-end">{_brand}</span>
			</div>
		</div>
	)
}
