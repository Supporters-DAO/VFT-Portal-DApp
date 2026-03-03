'use client'

import * as React from 'react'
import useEmblaCarousel, {
	type UseEmblaCarouselType,
} from 'embla-carousel-react'
// import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sprite } from '@/components/ui/sprite'
import { ButtonHTMLAttributes } from 'react'
// import { ButtonNew } from '@/components/ui/button-new'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
export type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
	opts?: CarouselOptions
	plugins?: CarouselPlugin
	orientation?: 'horizontal' | 'vertical'
	setApi?: (api: CarouselApi) => void
	Component?: any
}

type CarouselContextProps = {
	carouselRef: ReturnType<typeof useEmblaCarousel>[0]
	api: ReturnType<typeof useEmblaCarousel>[1]
	scrollPrev: () => void
	scrollNext: () => void
	canScrollPrev: boolean
	canScrollNext: boolean
} & CarouselProps

type CarouselComponentProps = React.HTMLAttributes<HTMLDivElement> &
	CarouselProps & {
		ref?: React.Ref<HTMLDivElement>
	}

type CarouselContentProps = React.HTMLAttributes<HTMLDivElement> & {
	classNameWrapper?: string
	ref?: React.Ref<HTMLDivElement>
}

type CarouselItemProps = React.HTMLAttributes<HTMLDivElement> & {
	ref?: React.Ref<HTMLDivElement>
}

type CarouselButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	ref?: React.Ref<HTMLButtonElement>
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
	const context = React.useContext(CarouselContext)

	if (!context) {
		throw new Error('useCarousel must be used within a <Carousel />')
	}

	return context
}

function Carousel({
	orientation = 'horizontal',
	opts,
	setApi,
	plugins,
	className,
	children,
	Component = 'div',
	ref,
	...props
}: CarouselComponentProps) {
	const [carouselRef, api] = useEmblaCarousel(
		{
			...opts,
			axis: orientation === 'horizontal' ? 'x' : 'y',
		},
		plugins
	)
	const [canScrollPrev, setCanScrollPrev] = React.useState(false)
	const [canScrollNext, setCanScrollNext] = React.useState(false)

	const onSelect = React.useCallback((api: CarouselApi) => {
		if (!api) {
			return
		}

		setCanScrollPrev(api.canScrollPrev())
		setCanScrollNext(api.canScrollNext())
	}, [])

	const scrollPrev = React.useCallback(() => {
		api?.scrollPrev()
	}, [api])

	const scrollNext = React.useCallback(() => {
		api?.scrollNext()
	}, [api])

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key === 'ArrowLeft') {
				event.preventDefault()
				scrollPrev()
			} else if (event.key === 'ArrowRight') {
				event.preventDefault()
				scrollNext()
			}
		},
		[scrollPrev, scrollNext]
	)

	React.useEffect(() => {
		if (!api || !setApi) {
			return
		}

		setApi(api)
	}, [api, setApi])

	React.useEffect(() => {
		if (!api) {
			return
		}

		onSelect(api)
		api.on('reInit', onSelect)
		api.on('select', onSelect)

		return () => {
			api?.off('select', onSelect)
		}
	}, [api, onSelect])

	return (
		<CarouselContext.Provider
			value={{
				carouselRef,
				api: api,
				opts,
				orientation:
					orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
				scrollPrev,
				scrollNext,
				canScrollPrev,
				canScrollNext,
			}}
		>
			<Component
				ref={ref}
				onKeyDownCapture={handleKeyDown}
				className={cn('relative', className)}
				role="region"
				aria-roledescription="carousel"
				{...props}
			>
				{children}
			</Component>
		</CarouselContext.Provider>
	)
}
Carousel.displayName = 'Carousel'

function CarouselContent({
	className,
	classNameWrapper,
	ref,
	...props
}: CarouselContentProps) {
	const { carouselRef, orientation } = useCarousel()

	return (
		<div ref={carouselRef} className={cn('overflow-hidden', classNameWrapper)}>
			<div
				ref={ref}
				className={cn(
					'flex will-change-auto',
					orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
					className
				)}
				{...props}
			/>
		</div>
	)
}
CarouselContent.displayName = 'CarouselContent'

function CarouselItem({ className, ref, ...props }: CarouselItemProps) {
	const { orientation } = useCarousel()

	return (
		<div
			ref={ref}
			role="group"
			aria-roledescription="slide"
			className={cn(
				'min-w-0 shrink-0 grow-0 basis-full',
				orientation === 'horizontal' ? 'pl-4' : 'pt-4',
				className
			)}
			{...props}
		/>
	)
}
CarouselItem.displayName = 'CarouselItem'

function CarouselPrevious({
	className,
	children,
	ref,
	...props
}: CarouselButtonProps) {
	const { orientation, scrollPrev, canScrollPrev } = useCarousel()

	return (
		<button
			ref={ref}
			// variant={variant}
			// size={size}
			className={cn(
				'p-0 enabled:hover:text-black/70 enabled:focus-visible:text-black/70 enabled:active:text-black/50',
				orientation === 'horizontal' ? '' : 'rotate-90',
				className
			)}
			disabled={!canScrollPrev}
			onClick={scrollPrev}
			{...props}
		>
			{children ?? <Sprite name="arrow-left" className="size-4" />}
			<span className="sr-only">Previous slide</span>
		</button>
	)
}
CarouselPrevious.displayName = 'CarouselPrevious'

function CarouselNext({
	className,
	children,
	ref,
	...props
}: CarouselButtonProps) {
	const { orientation, scrollNext, canScrollNext } = useCarousel()

	return (
		<button
			ref={ref}
			// variant={variant}
			// size={size}
			className={cn(
				'p-0 enabled:hover:text-black/70 enabled:focus-visible:text-black/70 enabled:active:text-black/50',
				orientation === 'horizontal' ? '' : 'rotate-90',
				className
			)}
			{...props}
			disabled={!canScrollNext}
			onClick={scrollNext}
		>
			{children || <Sprite name="arrow-left" className="size-4 rotate-180" />}
			<span className="sr-only">Next slide</span>
		</button>
	)
}
CarouselNext.displayName = 'CarouselNext'

export {
	useCarousel,
	type CarouselApi,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
}
