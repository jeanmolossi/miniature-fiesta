import { Wallet } from "domain/wallets/wallet"
import { getWallets } from "@/data/usecase/get-wallets"
import Card from "@/presentation/components/card"
import Heading from "@/presentation/components/heading"
import { RenderIf } from "@/presentation/components/render-if"

export default async function WalletsPage() {
	const { payments, meta } = await getWallets()

	if (meta.total === 0)
		return (
			<Card
				title="Nenhum meio de pagamento encontrado"
				hint="Escolha uma conta e adicione um meio de pagamento"
				goBackAction
			/>
		)

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
