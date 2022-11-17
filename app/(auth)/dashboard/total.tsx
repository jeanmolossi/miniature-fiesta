interface TotalProps { total: number; }

export function Total({ total: reducedTotal }: TotalProps) {
	const total = new Intl
		.NumberFormat(
			'pt-BR',
			{ style: 'currency', currency: 'BRL' }
		)
		.format(reducedTotal)

	const isPositive = reducedTotal > 0
	const isNegative = reducedTotal < 0

	const {
		txtColor,
		bColor
	} = isPositive
		? { txtColor: 'text-green-600', bColor: 'border-green-600' }
		: isNegative
			? { txtColor: 'text-rose-600', bColor: 'border-rose-600' }
			: { txtColor: 'text-gray-700', bColor: 'border-gray-700' };

	return (
		<div className='flex flex-1 w-full justify-end col-span-12'>
			<div className={`border border-dashed ${bColor} p-4 rounded-lg w-full sm:w-fit`}>
				<span className={`font-medium text-lg ${txtColor}`}>
					Total: {total}
				</span>
			</div>
		</div>
	)
}
