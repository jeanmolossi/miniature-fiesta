import { getMyAccounts } from '@/data/usecase/my-accounts'
import { Account } from 'domain/accounts/account'
import Heading from '@/presentation/components/heading'

export default async function DashboardPage() {
	const data = await getMyAccounts()

	const columns = Math.min(4, data.accounts.length)

	return (
		<div className={`grid grid-cols-${columns} gap-4`}>
			{data.accounts.length > 0
				? (data.accounts.map(AccountCard))
				: null
			}
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
		<div key={id} className="col-span-1 p-4 bg-white rounded-lg shadow-sm">
			<Heading as='h4'>{name}</Heading>
			<div>
				<p className='text-gray-400'>Saldo atual</p>
				<strong className={balance}>{current_amount_fmt}</strong>
			</div>
		</div>
	)
}
