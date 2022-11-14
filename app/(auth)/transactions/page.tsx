import { GetTransactionFilters, getTransactions } from "@/data/usecase/get-transactions"
import Heading from '@/presentation/components/heading';
import { RenderIf } from '@/presentation/components/render-if';
import Pagination from '@/presentation/components/pagination';
import SelectPeriod from './select-period';
import TransactionCard, { TransactionCardHead } from '@/presentation/components/transaction-card';

interface TransactionsPageParams {
	params: object;
	searchParams: GetTransactionFilters
}

export default async function TransactionsPage({ searchParams }:TransactionsPageParams) {
	const { account, page = 1, per_page = 20, sort, start_date } = searchParams
	const { transactions, meta } = await getTransactions({ account, page, per_page, sort, start_date })

	if (meta.total === 0)
		return <Heading>Nenhuma transação registrada</Heading>

	return (
		<div className="grid grid-cols-12 sm:flex sm:flex-1 sm:flex-col items-stretch min-h-screen gap-2">
			<div className='col-span-12'>
				<div className='flex flex-1 font-medium text-gray-600 items-center gap-4'>
					<div className='flex sm:gap-4 flex-col sm:flex-row'>
						<span>Página: {page.toString()}</span>
						<span>Itens por página: {per_page.toString()}</span>
					</div>

					<SelectPeriod resource="transactions" />
				</div>
			</div>

			<RenderIf condition={transactions.length > 0}>
				<div className='col-span-12 '>
					<div className='overflow-x-auto lg:overflow-x-visible'>
						<table className="table text-gray-400 border-separate border-spacing-1 space-y-6 text-sm min-w-max w-full">
							<thead className='bg-white text-gray-600'>
								<TransactionCardHead />
							</thead>

							<tbody>
								{(transactions.map(TransactionCard))}
							</tbody>
						</table>
					</div>
				</div>
			</RenderIf>

			<Pagination
				meta={meta}
				resource="transactions"
				excludeKeys={['relations']}
			/>
		</div>
	)
}

