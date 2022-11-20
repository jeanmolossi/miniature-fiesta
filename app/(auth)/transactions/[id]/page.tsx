import { getTransactions } from "@/data/usecase/get-transactions";
import Card from "@/presentation/components/card";
import Pagination from "@/presentation/components/pagination";
import Table from "@/presentation/components/table";
import TransactionCard, { TransactionCardHead } from "@/presentation/components/transaction-card";
import SelectPeriod from "../select-period";

interface TransactionsPageProps {
	params: {
		id: string;
	};
	searchParams: {
		page?: number;
		per_page?: number;
		sort?: string;
		start_date?: string;
	};
}

export default async function TransactionsPage({ params, searchParams }: TransactionsPageProps) {
	const { id: account } = params
	const { page = 1, per_page = 20, sort, start_date } = searchParams;

	const { transactions, meta } = await getTransactions({ account, page, per_page, sort, start_date })

	if (meta.total === 0)
		return (
			<Card
				title="Nenhuma transação registrada"
				hint="Adicione uma nova transação"
				goBackAction
				gotoAction={{
					label: 'Nova transação',
					href: `/transactions/${account}/new`
				}}
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

					<SelectPeriod resource={`transactions/${account}`} />
				</div>
			</div>

			<div className="grid grid-cols-12 cols-span12">
				<Table
					data={transactions}
					renderHead={<TransactionCardHead />}
					renderItem={TransactionCard}
				/>

				<Pagination
					meta={meta}
					resource={`transactions/${account}`}
					excludeKeys={['relations']}
				/>
			</div>
		</div>
	)
}
