'use client'

import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import styles from './scroll-area.module.scss'
import { cn } from '@/lib/utils'

function ScrollBar({
	className,
	orientation = 'vertical',
	ref,
	...props
}: React.ComponentPropsWithRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			ref={ref}
			orientation={orientation}
			className={cn(
				styles.scrollbar,
				orientation === 'vertical' && styles.vertical,
				orientation === 'horizontal' && styles.horizontal,
				className
			)}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb className={styles.thumb} />
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	)
}
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

function ScrollArea({
	className,
	children,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof ScrollAreaPrimitive.Root>) {
	return (
		<ScrollAreaPrimitive.Root
			ref={ref}
			className={cn(styles.root, className)}
			{...props}
		>
			<ScrollAreaPrimitive.Viewport className={styles.viewport}>
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	)
}
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export { ScrollArea, ScrollBar }
