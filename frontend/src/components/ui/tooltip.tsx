'use client'

import { cn } from '@/lib/utils'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as React from 'react'
import { ReactNode } from 'react'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

function TooltipContent({
	className,
	sideOffset = 4,
	side = 'top',
	ref,
	...props
}: React.ComponentPropsWithRef<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			side={side}
			className={cn(
				'animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 z-50 overflow-hidden rounded-md bg-black/90 p-4 text-sm/6 text-white shadow-[0_0.5rem_1rem] shadow-black/25',
				className
			)}
			{...props}
		/>
	)
}
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export function TooltipContainer({
	trigger,
	children,
	delay,
	side = 'top',
}: BaseComponentProps & {
	trigger: ReactNode
	delay?: number
	side?: 'top' | 'right' | 'bottom' | 'left' | undefined
}) {
	return (
		<TooltipProvider delayDuration={delay}>
			<TooltipPrimitive.Root>
				<TooltipPrimitive.Trigger asChild>
					<div>{trigger}</div>
				</TooltipPrimitive.Trigger>
				<TooltipPrimitive.Portal>
					<TooltipPrimitive.Content
						className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 font-poppins rounded-[4px] bg-[#D0D3D9] px-[15px] py-[10px] text-[12px] leading-none text-black shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] select-none"
						sideOffset={5}
						side={side}
					>
						{children}
					</TooltipPrimitive.Content>
				</TooltipPrimitive.Portal>
			</TooltipPrimitive.Root>
		</TooltipProvider>
	)
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
