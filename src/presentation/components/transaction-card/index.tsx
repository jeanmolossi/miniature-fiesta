import { Transaction } from "domain/transactions/transaction";
import { formatDate } from "../helpers/format-date-distance";

export function TransactionCardHead() {
	return (
		<tr>
			<th className='p-3'>#</th>
			<th className='p-3'>Referência</th>
			<th className='p-3 text-right'>Valor</th>
			<th className='p-3 text-left'>Categoria</th>
			<th className='p-3 text-right'>Data</th>
		</tr>
	)
}

export default function TransactionCard({ id, reference, type, value_fmt, created_at, category }: Transaction, i: number){
	const color = type === 'EXPENSE'
		? 'text-red-500'
		: 'text-green-500';

	return (
		<tr key={id} className='bg-white shadow-sm hover:bg-gray-100 transition-colors'>
			<td className='p-3 text-center font-medium'>{i+1}</td>
			<td className='p-3'>{reference}</td>
			<td className={`p-3 text-right font-medium ${color}`}>{value_fmt}</td>
			<td className='p-3'>{category?.name || 'Sem categoria'}</td>
			<td className={`p-3 text-gray-400 text-end`}>{formatDate(created_at)}</td>
		</tr>
	)
}

