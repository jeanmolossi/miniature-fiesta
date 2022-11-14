import { RenderIf } from "../render-if";

export type ColumnValue<T> = (t: T, index?: number) => string | number | React.ReactNode
export type ColumnMap<T> = [string, ColumnValue<T>]

interface TableProps<T> {
	data: T[];
	renderHead: React.ReactNode | React.ReactElement;
	renderItem: (row: T, i: number, rows: T[]) => React.ReactNode;
	headClassName?: string;
	bodyRowClassName?: string;
	bodyColumnClassName?: string;
}

export default function Table<T>({
	data = [],
	renderHead: HeadCols,
	renderItem = () => 'No item to render',
}: TableProps<T>) {
	if (data.length === 0)
		return (
			<>Empty card</>
		)

	return (
		<div className='col-span-12'>
			<div className='overflow-x-auto lg:overflow-x-visible'>
				<table className="table text-gray-400 border-separate border-spacing-1 space-y-6 text-sm min-w-max w-full">
					<thead className="bg-white text-gray-600">
						<RenderIf condition={Boolean(HeadCols)}>
							{HeadCols}
						</RenderIf>
					</thead>

					<tbody>
						{data.map(renderItem)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

