'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'

const Accordion = AccordionPrimitive.Root

function AccordionItem({
	ref,
	...props
}: React.ComponentPropsWithRef<typeof AccordionPrimitive.Item>) {
	return <AccordionPrimitive.Item ref={ref} {...props} />
}
AccordionItem.displayName = 'AccordionItem'

function AccordionTrigger({
	className,
	children,
	noIcon,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof AccordionPrimitive.Trigger> & {
		noIcon?: boolean
}) {
	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				ref={ref}
				className={cn(
					'group flex flex-1 transform-gpu items-center justify-between gap-x-5 text-left transition-all',
					className
				)}
				{...props}
			>
				{children}
				{/*{!noIcon && (*/}
				{/*	<ChevronDown className="size-4.5 shrink-0 transition-transform duration-200 group-radix-state-open:rotate-180" />*/}
				{/*)}*/}
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	)
}
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

function AccordionContent({
	className,
	classNameInner,
	children,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof AccordionPrimitive.Content> & {
		classNameInner?: string
}) {
	return (
		<AccordionPrimitive.Content
			ref={ref}
			className={cn(
				'transform-gpu overflow-hidden transition-all duration-300 radix-state-closed:animate-accordion-up radix-state-open:animate-accordion-down',
				className
			)}
			{...props}
		>
			<div className={cn(classNameInner)}>{children}</div>
		</AccordionPrimitive.Content>
	)
}

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
