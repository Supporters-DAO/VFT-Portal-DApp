'use client'

import Image from 'next/image'
import { type Easing, motion } from 'framer-motion'

type Props = {
	className?: string
}

const duration = 12
const ease: Easing = 'easeIn'
// const repeatType: Repeat['repeatType'] = 'loop'
// const repeatDelay: Repeat['repeatDelay'] = 1

export function CreateTokenBannerAnimation({ className }: Props) {
	return (
		<div className={className} aria-hidden>
			{/*Left*/}
			<motion.div
				className="pointer-events-none absolute -bottom-2.5 -left-5 select-none max-lg:top-0 sm:bottom-0 lg:left-0"
				initial={{ opacity: 0 }}
				transition={{
					duration,
					ease,
					// times,
					repeat: Infinity,
					// repeatDelay: duration / 2,
					// repeatType,
					// delay: duration / 2,
				}}
				whileInView={{
					opacity: [0, 0, 0, 0, 1, 1, 0, 0],
				}}
			>
				<Image
					src="/images/banner-t-l-mobile.svg"
					alt="Tokenator"
					width={574}
					height={564}
					className="aspect-[574/564] object-left max-lg:size-full max-lg:object-contain lg:hidden"
				/>
				<Image
					src="/images/banner-t-l.svg"
					alt="Tokenator"
					width={458}
					height={505}
					className="hidden object-left lg:block"
				/>
			</motion.div>
			{/*Right*/}
			<motion.div
				className="pointer-events-none absolute -bottom-2.5 right-2.5 select-none max-lg:top-0 sm:bottom-0 lg:-right-10 xl:-right-15"
				initial={{ opacity: 1 }}
				transition={{
					duration,
					ease,
					// times,
					repeat: Infinity,
					// repeatType,
				}}
				whileInView={{
					opacity: [1, 1, 0, 0, 0, 0, 0, 0],
				}}
			>
				<Image
					src="/images/banner-t-r-mobile.svg"
					alt="Tokenator"
					width={574}
					height={564}
					className="aspect-[574/564] max-lg:size-full max-lg:object-contain lg:hidden"
				/>
				<Image
					src="/images/banner-t-r.svg"
					alt="Tokenator"
					width={572}
					height={505}
					className="hidden lg:block"
				/>
			</motion.div>
		</div>
	)
}
