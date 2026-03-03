'use client'

import { cn } from '@/lib/utils'
import * as SelectPrimitive from '@radix-ui/react-select'
import * as React from 'react'
import { Check, ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

type SelectTriggerProps = React.ComponentPropsWithRef<
	typeof SelectPrimitive.Trigger
> & {
	classNameIcon?: string
}

function SelectTrigger({
	className,
	classNameIcon,
	children,
	ref,
	...props
}: SelectTriggerProps) {
	return (
		<SelectPrimitive.Trigger
			ref={ref}
			className={cn(
				'group flex w-full items-center justify-between rounded-md bg-black/5 px-3 py-2 text-sm transition placeholder:text-black/70 data-open:bg-black/[3%] disabled:cursor-not-allowed disabled:opacity-50 hocus:bg-black/[3%] [&>span]:line-clamp-1',
				className
			)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<ChevronDown
					className={cn('ml-2 size-4 group-data-open:rotate-180', classNameIcon)}
				/>
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	)
}
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

function SelectScrollUpButton({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.ScrollUpButton>) {
	return (
		<SelectPrimitive.ScrollUpButton
			ref={ref}
			className={cn(
				'flex cursor-default items-center justify-center py-1',
				className
			)}
			{...props}
		>
			<ChevronUp className="size-4" />
		</SelectPrimitive.ScrollUpButton>
	)
}
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

function SelectScrollDownButton({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.ScrollDownButton>) {
	return (
		<SelectPrimitive.ScrollDownButton
			ref={ref}
			className={cn(
				'flex cursor-default items-center justify-center py-1',
				className
			)}
			{...props}
		>
			<ChevronDown className="size-4" />
		</SelectPrimitive.ScrollDownButton>
	)
}
SelectScrollDownButton.displayName =
	SelectPrimitive.ScrollDownButton.displayName

function SelectContent({
	className,
	children,
	position = 'popper',
	ref,
	...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.Content>) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				ref={ref}
				className={cn(
					'relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md bg-[#1D2C4B] text-base data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
					position === 'popper' &&
						'data-[side=bottom]:translate-y-2 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:translate-y-1',
					className
				)}
				position={position}
				{...props}
			>
				<SelectScrollUpButton />
				<SelectPrimitive.Viewport
					className={cn(
						'p-1',
						position === 'popper' &&
							'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
					)}
				>
					{children}
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	)
}
SelectContent.displayName = SelectPrimitive.Content.displayName

function SelectLabel({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.Label>) {
	return (
		<SelectPrimitive.Label
			ref={ref}
			className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
			{...props}
		/>
	)
}
SelectLabel.displayName = SelectPrimitive.Label.displayName

function SelectItem({
	className,
	children,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			ref={ref}
			className={cn(
				'relative flex w-full cursor-default select-none items-center justify-between space-x-2 rounded-sm px-3 py-1 font-poppins text-base outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-black/5',
				className
			)}
			{...props}
		>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	)
}
SelectItem.displayName = SelectPrimitive.Item.displayName

function SelectSeparator({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.Separator>) {
	return (
		<SelectPrimitive.Separator
			ref={ref}
			className={cn('bg-muted -mx-1 my-1 h-px', className)}
			{...props}
		/>
	)
}
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
}
