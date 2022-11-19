import { getWallets } from "@/data/usecase/get-wallets"
import Card from "@/presentation/components/card"
import Heading from "@/presentation/components/heading"
import Pagination from "@/presentation/components/pagination"
import Table from "@/presentation/components/table"
import { WalletHeadTable, WalletRowTable } from "@/presentation/components/table/wallet-rows"

export default async function WalletsPage() {
	const { payments, meta } = await getWallets({
		relations: ['account'],
		fields: ['id', 'name', 'type', 'brand', 'limit', 'account.id']
	})

	if (meta.total === 0)
		return (
			<Card
				title="Nenhum meio de pagamento encontrado"
				hint="Escolha uma conta e adicione um meio de pagamento"
				goBackAction
			/>
		)

	return (
		<div className="grid grid-cols-12 sm:flex sm:flex-1 sm:flex-col sm:items-stretch min-h-screen gap-2">
			<Heading as="h3" className="block w-full col-span-12">Meios de pagamento</Heading>

			<Table
				data={payments}
				renderHead={<WalletHeadTable />}
				renderItem={WalletRowTable}
			/>

			<Pagination
				meta={meta}
				resource="wallets"
				excludeKeys={['relations']}
			/>
		</div>
	)
}
