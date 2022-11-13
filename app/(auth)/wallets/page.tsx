import { getWallets } from "@/data/usecase/get-wallets"
import Heading from "@/presentation/components/heading"
import { RenderIf } from "@/presentation/components/render-if"
import { Wallet } from "domain/wallets/wallet"

export default async function WalletsPage() {
	const { payments, meta } = await getWallets()

	if (meta.total === 0)
		return <div><span role={'banner'}>Nenhuma carteira encontrada</span></div>

	const columns = Math.min(4, payments.length);

	return (
		<div className={`grid grid-cols-${columns} gap-4`}>
			<RenderIf condition={Boolean(payments.length)}>
				{payments.map(WalletCard)}
			</RenderIf>
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
