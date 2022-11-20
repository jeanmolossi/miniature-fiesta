import Link from 'next/link'
import { Account } from 'domain/accounts/account'
import { getMyAccounts } from '@/data/usecase/my-accounts'
import Heading from '@/presentation/components/heading'
import { Total } from './total'

export const revalidate = 15

export default async function DashboardPage() {
	const data = await getMyAccounts()

	if (data.meta.total === 0)
		return <span role={'banner'}>Nenhuma conta encontrada</span>

	const reducedTotal = data.accounts.reduce((acc, account) => {
		return acc + account.current_amount
	}, 0) / 100

	return (
		<div className='grid grid-cols-12 gap-4'>
			<div className={`grid grid-cols-12 sm:grid-cols-4 xl:grid-cols-12 col-span-12 gap-4`}>
				{(data.accounts.map(AccountCard))}
			</div>

			<Total total={reducedTotal} />
		</div>
	)
}

const AccountCard = ({ id, name, current_amount_fmt, current_amount }: Account) => {
	const balance = current_amount > 0
		? 'text-green-500'
		: current_amount < 0
		? 'text-red-500'
		: 'text-gray-500'

	return (
		<div key={id} className="col-span-12 sm:col-span-2 xl:col-span-4 p-4 bg-white rounded-lg shadow-sm relative">
			<div className="grid grid-cols-12">
				<div className='col-span-8'>
					<Heading as='h4'>{name}</Heading>
				</div>
				<div className='col-span-4 text-right'>
					<p className='text-gray-400'>Saldo atual</p>
					<strong className={balance}>{current_amount_fmt}</strong>
				</div>
			</div>

			<div className="grid grid-cols-12 gap-2 text-center font-medium text-sm text-gray-600 border-t mt-2 pt-2">
				<ActionButton
					href={`/transactions/${id}/new`}
					label="+ Transação"
				/>

				<ActionButton
					href={`/wallets/${id}/new`}
					label="+ Meio de pagamento"
				/>

				<ActionButton
					href={`/transactions/${id}`}
					label="Transações"
				/>

				<ActionButton
					href={`/wallets/${id}`}
					label="Meios de pagamento"
				/>
			</div>
		</div>
	)
}

interface ActionButtonProps {
	href: string;
	label: string;
}

const ActionButton = ({ href, label }: ActionButtonProps) => {
	return (
		<div className="col-span-6">
			<Link
				href={href}
				className="block text-indigo-600 border border-indigo-600 ring-1 ring-indigo-600 rounded-md py-1"
			>
				{label}
			</Link>
		</div>
	)
}
