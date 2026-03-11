import { useEffect, useId, useRef, useState, type JSX } from 'react';
import { AnimationPlaybackControls, useAnimate, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

export const TICKER_DIRECTION_LEFT = -1
export const TICKER_DIRECTION_RIGHT = 1

type TickerProps = {
	children: JSX.Element[]
	duration?: number
	onMouseEnter?: () => void
	onMouseLeave?: () => void
	isPlaying?: boolean
	direction?: number
	className?: string
	classNameContainer?: string
}

const noop = () => {}

export function Ticker({
	children,
	duration = 10,
	onMouseEnter = noop,
	onMouseLeave = noop,
	isPlaying = true,
	direction = TICKER_DIRECTION_LEFT,
	className,
	classNameContainer,
}: TickerProps) {
	const tickerRef = useRef<HTMLDivElement>(null)
	const tickerUUID = useId()
	const [tickerContentWidth, setTickerContentWidth] = useState<number | null>(0)
	const [numDupes, setNumDupes] = useState<number>(1)
	const [scope, animate] = useAnimate()
	const [animationControls, setAnimationControls] = useState<
		AnimationPlaybackControls | undefined
	>(undefined)
	const isInView = useInView(scope)

	useEffect(() => {
		let contentWidth = 0

		for (let index = 0; index < children.length; index++) {
			const element = document.getElementById(
				tickerUUID + '_' + index
			)?.clientWidth
			if (element) {
				contentWidth += element
			}
		}

		setTickerContentWidth(contentWidth)
	})

	useEffect(() => {
		if (tickerRef.current && tickerContentWidth) {
			setNumDupes(
				Math.max(
					Math.ceil((2 * tickerRef.current.clientWidth) / tickerContentWidth),
					1
				)
			)
		}
	}, [tickerRef.current, tickerContentWidth])

	useEffect(() => {
		if (isInView && !animationControls) {
			const controls = animate(
				scope.current,
				{ x: tickerContentWidth ? tickerContentWidth * direction : 0 },
				{ ease: 'linear', duration, repeat: Infinity }
			)
			controls.play()
			setAnimationControls(controls)
		}
	}, [isInView])

	useEffect(() => {
		if (animationControls) {
			if (!isInView || !isPlaying) {
				animationControls.pause()
			} else {
				animationControls.play()
			}
		}
	}, [isInView, isPlaying])

	return (
		<div
			className={cn('size-full overflow-hidden', className)}
			ref={tickerRef}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			style={{
				width: '100%',
				height: '100%',
				overflow: 'hidden',
			}}
		>
			<div
				ref={scope}
				className={cn('flex', classNameContainer)}
				style={{ display: 'flex' }}
			>
				{children.map((item, index) => (
					<div key={index} id={`${tickerUUID}_${index}`}>
						{item}
					</div>
				))}
				{[...Array(numDupes)].map((_) =>
					children.map((item, index) => <div key={index}>{item}</div>)
				)}
			</div>
		</div>
	)
}
