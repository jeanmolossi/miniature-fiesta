import { GetTransactionFilters, getTransactions } from "@/data/usecase/get-transactions"
import { RenderIf } from '@/presentation/components/render-if';
import Pagination from '@/presentation/components/pagination';
import SelectPeriod from './select-period';
import TransactionCard, { TransactionCardHead } from '@/presentation/components/transaction-card';
import Table from "@/presentation/components/table";
import Card from "@/presentation/components/card";

interface TransactionsPageParams {
	params: object;
	searchParams: GetTransactionFilters
}

export default async function TransactionsPage({ searchParams }:TransactionsPageParams) {
	const { account, page = 1, per_page = 20, sort, start_date } = searchParams
	const { transactions, meta } = await getTransactions({ account, page, per_page, sort, start_date })

	if (meta.total === 0)
		return (
			<Card
				title="Nenhuma transação registrada"
				hint="Adicione uma nova transação"
				goBackAction
			/>
		)

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
				<Table
					data={transactions}
					renderHead={<TransactionCardHead />}
					renderItem={TransactionCard}
				/>
			</RenderIf>

			<Pagination
				meta={meta}
				resource="transactions"
				excludeKeys={['relations']}
			/>
		</div>
	)
}
