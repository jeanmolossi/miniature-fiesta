import { formatDistanceToNow, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { GetTransactionFilters, getTransactions } from "@/data/usecase/get-transactions"
import { Transaction } from "domain/transactions/transaction"

interface TransactionsPageParams {
	params: object;
	searchParams: GetTransactionFilters
}

export default async function TransactionsPage({ searchParams }:TransactionsPageParams) {
	const { account } = searchParams
	const { transactions } = await getTransactions({ account })

	return (
		<div className="flex flex-1 flex-col items-stretch gap-1">
			{transactions.length > 0
				? (transactions.map(TransactionCard))
				: null
			}
		</div>
	)
}

const TransactionCard = ({ id, reference, type, value_fmt, created_at, category }: Transaction) => {
	const color = type === 'EXPENSE'
		? 'text-red-500'
		: 'text-green-500';

	return (
		<div key={id} className="grid grid-cols-12 bg-white shadow-sm items-center p-2 rounded-sm hover:bg-gray-50">
			<span className="col-span-3">{reference}</span>
			<strong className={`${color} col-span-2`}>{value_fmt}</strong>
			<span className="col-span-3">{category?.name || 'Sem categoria'}</span>
			<div className='col-span-2'></div>
			<small className="text-gray-400 col-span-2 text-end">{formatDate(created_at)}</small>
		</div>
	)
}

function formatDate(date: string): string {
	return formatDistanceToNow(
		parseISO(date),
		{
			addSuffix: true,
			locale: ptBR
		}
	)
}
