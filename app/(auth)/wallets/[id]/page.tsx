import { getAccountWallets } from "@/data/usecase/get-account-wallets";
import Card from "@/presentation/components/card";
import Heading from "@/presentation/components/heading";
import Pagination from "@/presentation/components/pagination";
import Table from "@/presentation/components/table";
import { WalletHeadTable, WalletRowTable } from "@/presentation/components/table/wallet-rows";

interface WalletsPageProps {
	params: {
		id?: string;
	};
	searchParams: object;
}

export default async function WalletsPage({ params }: WalletsPageProps) {
	if (!params.id)
		return (
			<Card
				title="Selecione uma conta"
				hint="Volte a Dashboard e selecione uma conta"
				goBackAction
			/>
		)

	const { payments, meta } = await getAccountWallets({
		account: params.id,
		relations: ['account']
	})

	if (meta.total === 0)
		return (
			<Card
				title="Nenhum meio de pagamento encontrado"
				hint="Adicione um meio de pagamento à esta conta"
				goBackAction
				gotoAction={{
					label: 'Novo meio de pagamento',
					href: `/wallets/${params.id}/new`
				}}
			/>
		)

	return (
		<div className="grid grid-cols-12 sm:flex sm:flex-1 sm:flex-col items-stretch min-h-screen gap-2">
			<Heading as="h3">Meios de pagamento</Heading>

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





