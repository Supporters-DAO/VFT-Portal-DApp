'use client'

import { cn } from '@/lib/utils'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
import {
	ComponentPropsWithRef,
	HTMLAttributes,
} from 'react'

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

function DropdownMenuSubTrigger({
	className,
	inset,
	children,
	ref,
	...props
}: ComponentPropsWithRef<typeof DropdownMenuPrimitive.SubTrigger> & {
		inset?: boolean
}) {
	return (
		<DropdownMenuPrimitive.SubTrigger
			ref={ref}
			className={cn(
				'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm font-normal outline-none data-[state=open]:bg-neutral-100',
				inset && 'pl-8',
				className
			)}
			{...props}
		>
			{children}
			<ChevronRight className="ml-auto size-4" />
		</DropdownMenuPrimitive.SubTrigger>
	)
}
DropdownMenuSubTrigger.displayName =
	DropdownMenuPrimitive.SubTrigger.displayName

function DropdownMenuSubContent({
	className,
	ref,
	...props
}: ComponentPropsWithRef<typeof DropdownMenuPrimitive.SubContent>) {
	return (
		<DropdownMenuPrimitive.SubContent
			ref={ref}
			className={cn(
				'z-50 min-w-32 overflow-hidden rounded-md border border-neutral-100 bg-white p-1 text-neutral-700 shadow-md',
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				className
			)}
			{...props}
		/>
	)
}
DropdownMenuSubContent.displayName =
	DropdownMenuPrimitive.SubContent.displayName

function DropdownMenuContent({
	className,
	sideOffset = 4,
	ref,
	...props
}: ComponentPropsWithRef<typeof DropdownMenuPrimitive.Content>) {
	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content
				ref={ref}
				sideOffset={sideOffset}
				className={cn(
					'z-50 min-w-40 overflow-hidden rounded-lg bg-[#0F1B34] py-4 text-[#FDFDFD] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 focus-visible:ring-0',
					className
				)}
				{...props}
			/>
		</DropdownMenuPrimitive.Portal>
	)
}
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

function DropdownMenuItem({
	className,
	ref,
	...props
}: ComponentPropsWithRef<typeof DropdownMenuPrimitive.Item>) {
	return (
		<DropdownMenuPrimitive.Item
			ref={ref}
			className={cn(
				'group relative flex cursor-pointer select-none items-center px-4 py-2.5 font-normal outline-none data-active:bg-white/5 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-white/5 md:px-6',
				className
			)}
			{...props}
		/>
	)
}
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

function DropdownMenuCheckboxItem({
	className,
	children,
	checked,
	ref,
	...props
}: ComponentPropsWithRef<typeof DropdownMenuPrimitive.CheckboxItem>) {
	return (
		<DropdownMenuPrimitive.CheckboxItem
			ref={ref}
			className={cn(
				'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm font-medium outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
				className
			)}
			checked={checked}
			{...props}
		>
			<span className="absolute left-2 flex size-3.5 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<Check className="size-4" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.CheckboxItem>
	)
}
DropdownMenuCheckboxItem.displayName =
	DropdownMenuPrimitive.CheckboxItem.displayName

function DropdownMenuRadioItem({
	className,
	children,
	ref,
	...props
}: ComponentPropsWithRef<typeof DropdownMenuPrimitive.RadioItem>) {
	return (
		<DropdownMenuPrimitive.RadioItem
			ref={ref}
			className={cn(
				'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm font-medium outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
				className
			)}
			{...props}
		>
			<span className="absolute left-2 flex size-3.5 items-center justify-center">
				<DropdownMenuPrimitive.ItemIndicator>
					<Circle className="size-2 fill-current" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.RadioItem>
	)
}
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

function DropdownMenuLabel({
	className,
	inset,
	ref,
	...props
}: ComponentPropsWithRef<typeof DropdownMenuPrimitive.Label> & {
		inset?: boolean
}) {
	return (
		<DropdownMenuPrimitive.Label
			ref={ref}
			className={cn(
				'px-2 py-1.5 text-sm font-semibold text-black',
				inset && 'pl-8',
				className
			)}
			{...props}
		/>
	)
}
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

function DropdownMenuSeparator({
	className,
	ref,
	...props
}: ComponentPropsWithRef<typeof DropdownMenuPrimitive.Separator>) {
	return (
		<DropdownMenuPrimitive.Separator
			ref={ref}
			className={cn('my-1 h-px bg-[#FDFDFD]/[2%]', className)}
			{...props}
		/>
	)
}
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
	className,
	...props
}: HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			className={cn(
				'ml-auto text-xs tracking-widest text-neutral-500 group-data-[m-delete="true"]:text-inherit group-data-[m-delete="true"]:opacity-60',
				className
			)}
			{...props}
		/>
	)
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup,
}
