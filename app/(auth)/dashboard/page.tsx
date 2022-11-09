import Link from 'next/link'
import { getMyAccounts } from '@/data/usecase/my-accounts'
import { Account } from 'domain/accounts/account'
import Heading from '@/presentation/components/heading'
import './dashboard.scss';

export default async function DashboardPage() {
	const data = await getMyAccounts()

	if (data.meta.total === 0)
		return <span role={'banner'}>Nenhuma conta encontrada</span>

	const columns = Math.min(4, data.meta.total)

	return (
		<div className={`grid grid-cols-${columns} gap-4`}>
			{(data.accounts.map(AccountCard))}
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
		<div key={id} className="col-span-1 p-4 bg-white rounded-lg shadow-sm relative">
			<Heading as='h4'>{name}</Heading>
			<div>
				<p className='text-gray-400'>Saldo atual</p>
				<strong className={balance}>{current_amount_fmt}</strong>
			</div>

			<Link
				href={`/transactions/${id}/new`}
				className='more-link'
			>+</Link>
		</div>
	)
}
