import * as React from 'react'

import { cn } from '@/lib/utils'

type TableProps = React.HTMLAttributes<HTMLTableElement> & {
	ref?: React.Ref<HTMLTableElement>
}

type TableSectionProps = React.HTMLAttributes<HTMLTableSectionElement> & {
	ref?: React.Ref<HTMLTableSectionElement>
}

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
	ref?: React.Ref<HTMLTableRowElement>
}

type TableRowClickableProps = TableRowProps & {
	onRowClick?: () => void
}

type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
	ref?: React.Ref<HTMLTableCellElement>
}

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
	ref?: React.Ref<HTMLTableCellElement>
}

type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement> & {
	ref?: React.Ref<HTMLTableCaptionElement>
}

function Table({ className, ref, ...props }: TableProps) {
	return (
		<div className="relative w-full overflow-auto">
			<table
				ref={ref}
				className={cn(
					'w-full caption-bottom divide-y divide-neutral-700 text-sm',
					className
				)}
				{...props}
			/>
		</div>
	)
}
Table.displayName = 'Table'

function TableHeader({ className, ref, ...props }: TableSectionProps) {
	return (
		<thead
			ref={ref}
			className={cn(
				'whitespace-nowrap align-middle text-xs/5 [&_th:first-child]:pl-5 [&_th]:h-10',
				className
			)}
			{...props}
		/>
	)
}
TableHeader.displayName = 'TableHeader'

function TableBody({ className, ref, ...props }: TableSectionProps) {
	return (
		<tbody
			ref={ref}
			className={cn('divide-y divide-[#FDFDFD]/[4%] align-middle', className)}
			{...props}
		/>
	)
}
TableBody.displayName = 'TableBody'

function TableFooter({ className, ref, ...props }: TableSectionProps) {
	return (
		<tfoot
			ref={ref}
			className={cn('bg-primary font-medium', className)}
			{...props}
		/>
	)
}
TableFooter.displayName = 'TableFooter'

function TableRow({ className, ref, ...props }: TableRowProps) {
	return <tr ref={ref} className={className} {...props} />
}
TableRow.displayName = 'TableRow'

function TableRowClickable({
	className,
	onRowClick,
	ref,
	...props
}: TableRowClickableProps) {
	return (
		<tr
			ref={ref}
			className={className}
			{...props}
			onClick={onRowClick}
			style={{ cursor: 'pointer' }}
		/>
	)
}
TableRowClickable.displayName = 'TableRowClickable'

function TableHead({ className, ref, ...props }: TableHeadProps) {
	return (
		<th
			ref={ref}
			className={cn(
				'px-2 py-1 text-left font-medium text-neutral-300 [&:has([role=checkbox])]:pr-0',
				className
			)}
			{...props}
		/>
	)
}
TableHead.displayName = 'TableHead'

function TableCell({ className, ref, ...props }: TableCellProps) {
	return <td ref={ref} className={cn('py-4 px-3', className)} {...props} />
}
TableCell.displayName = 'TableCell'

function TableCaption({ className, ref, ...props }: TableCaptionProps) {
	return (
		<caption ref={ref} className={cn('mt-4 text-sm', className)} {...props} />
	)
}
TableCaption.displayName = 'TableCaption'

function Table2({ className, ref, ...props }: TableProps) {
	return (
		<div className="relative w-full overflow-auto">
			<table ref={ref} className={cn('w-full', className)} {...props} />
		</div>
	)
}
Table2.displayName = 'Table2'

function TableHeader2({ className, ref, ...props }: TableSectionProps) {
	return (
		<thead
			ref={ref}
			className={cn(
				'select-none text-left text-[11px]/6 font-bold tracking-[1px] text-black/40',
				className
			)}
			{...props}
		/>
	)
}
TableHeader2.displayName = 'TableHeader2'

function TableBody2({ className, ref, ...props }: TableSectionProps) {
	return (
		<tbody
			ref={ref}
			className={cn(
				'[&_td:first-child]:rounded-lg [&_td:first-child]:rounded-r-none [&_td:first-child]:border-l [&_td:first-child]:pl-[11px] [&_td:last-child]:rounded-lg [&_td:last-child]:rounded-l-none [&_td:last-child]:border-r [&_td:last-child]:pr-[11px] [&_td:only-child]:rounded-lg [&_td]:border [&_td]:border-x-0 [&_td]:border-black/[7%] [&_td]:bg-white [&_td]:leading-none',
				className
			)}
			{...props}
		/>
	)
}
TableBody2.displayName = 'TableBody2'

function TableFooter2({ className, ref, ...props }: TableSectionProps) {
	return <tfoot ref={ref} className={className} {...props} />
}
TableFooter2.displayName = 'TableFooter2'

function TableRow2({ className, ref, ...props }: TableRowProps) {
	return <tr ref={ref} className={className} {...props} />
}
TableRow2.displayName = 'TableRow2'

function TableHead2({ className, ref, ...props }: TableHeadProps) {
	return <th ref={ref} className={cn('px-3 pb-px pt-0', className)} {...props} />
}
TableHead2.displayName = 'TableHead2'

function TableCell2({ className, ref, ...props }: TableCellProps) {
	return <td ref={ref} className={cn('px-3 py-[11px]', className)} {...props} />
}
TableCell2.displayName = 'TableCell2'

function TableCaption2({ className, ref, ...props }: TableCaptionProps) {
	return <caption ref={ref} className={className} {...props} />
}
TableCaption2.displayName = 'TableCaption2'

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableRowClickable,
	TableCell,
	TableCaption,
	Table2,
	TableHeader2,
	TableBody2,
	TableFooter2,
	TableHead2,
	TableRow2,
	TableCell2,
	TableCaption2,
}
