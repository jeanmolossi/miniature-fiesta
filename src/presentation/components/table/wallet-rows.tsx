import Link from "next/link"
import { Wallet, WalletBrand, WalletType } from "domain/wallets/wallet"
import { RenderIf } from "../render-if"

export function WalletHeadTable() {
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

export function WalletRowTable({ id, name, type = WalletType.CASH, brand, readable_limit, account }: Wallet, i: number) {
	return (
		<tr key={id} className="bg-white shadow-sm hover:bg-gray-100 transition-colors">
			<td className="p-3 text-center font-medium">{i+1}</td>
			<td className="p-3 font-medium">{name}</td>
			<td className="p-3 text-center">{typeTransformer[type]}</td>
			<td className="p-3 text-center">{brandTransformer[brand || 'empty']}</td>
			<td className="p-3 text-right">{readable_limit || 'Não possui'}</td>
			<td className="p-3 text-center">
				<RenderIf condition={Boolean(account?.id)}>
					<Link
						href={`/transactions/${account.id}?wallet=${id}`}
						className="font-medium text-blue-600"
					>
						Ver transações
					</Link>
				</RenderIf>

				<RenderIf condition={!Boolean(account?.id)}>
					Sem conta
				</RenderIf>
			</td>
		</tr>
	)
}
