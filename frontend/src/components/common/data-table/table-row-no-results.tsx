import { TableCell2, TableRow2 } from '@/components/ui/table'
import { Table } from '@tanstack/react-table'

type TableRowNoResultsProps<T> = BaseComponentProps & {
	table: Table<T>
}

export function TableRowNoResults<TData>({
	children,
	table,
}: TableRowNoResultsProps<TData>) {
	return (
		<TableRow2 className="">
			<TableCell2
				colSpan={table.getAllColumns().length}
				className="h-24 text-center align-middle"
			>
				<div className="my-20 flex flex-col gap-5">
					<h1 className="font-silkscreen text-[28px]">No matching tokens</h1>
					<p className="text-[18px] text-white/[80%]">
						Nothing matched your search yet. Try a different token name, symbol,
						or address.
					</p>
				</div>
			</TableCell2>
		</TableRow2>
	)
}
