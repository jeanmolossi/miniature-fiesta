import Link from "next/link";
import { Wallet, WalletBrand, WalletType } from "domain/wallets/wallet";
import { getAccountWallets } from "@/data/usecase/get-account-wallets";
import Card from "@/presentation/components/card";
import Heading from "@/presentation/components/heading";
import Pagination from "@/presentation/components/pagination";
import Table from "@/presentation/components/table";

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

function WalletHeadTable() {
	return (
		<tr>
			<th className="p-3">#</th>
			<th className="p-3 text-left">Identificação</th>
			<th className="p-3">Tipo de carteira</th>
			<th className="p-3">Bandeira</th>
			<th className="p-3 text-right">Limite</th>
			<th className="p-3">Actions</th>
		</tr>
	)
}

const typeTransformer = {
	[WalletType.CASH]: 'Dinheiro',
	[WalletType.DEBIT]: 'Cartão de débito',
	[WalletType.CREDIT]: 'Cartão de crédito',
}

const brandTransformer = {
	[WalletBrand.ELO]: 'Elo',
	[WalletBrand.AMERICAN_EXPRESS]: 'American Express',
	[WalletBrand.MASTER]: 'Master Card',
	[WalletBrand.VISA]: 'Visa',
	['empty']: 'Não possui'
}

function WalletRowTable({ id, name, type = WalletType.CASH, brand, readable_limit, account }: Wallet, i: number) {
	return (
		<tr key={id} className="bg-white shadow-sm hover:bg-gray-100 transition-colors">
			<td className="p-3 text-center font-medium">{i+1}</td>
			<td className="p-3 font-medium">{name}</td>
			<td className="p-3 text-center">{typeTransformer[type]}</td>
			<td className="p-3 text-center">{brandTransformer[brand || 'empty']}</td>
			<td className="p-3 text-right">{readable_limit || 'Não possui'}</td>
			<td className="p-3 text-center">
				<Link
					href={`/transactions/${account.id}?wallet=${id}`}
					className="font-medium text-blue-600"
				>
					Ver transações
				</Link>
			</td>
		</tr>
	)
}
