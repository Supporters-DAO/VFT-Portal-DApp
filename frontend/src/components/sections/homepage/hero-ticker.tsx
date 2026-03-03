'use client'

import Ticker from 'framer-motion-ticker'
import Link from 'next/link'

type Props = {
	className?: string
}

export function HeroTicker({}: Props) {
	return (
		<Link
			href="/#about-memecoin"
			onClick={(e) => {
				e.preventDefault()
				const element = document.getElementById('about-memecoin')
				element?.scrollIntoView({ behavior: 'smooth' })
			}}
			className="relative z-1 select-none bg-[#C3C5EA] py-3 text-[12px] leading-none text-[#242424] sm:py-5 sm:text-[20px]"
		>
			<Ticker duration={120}>
				{Array.from({ length: 10 }).map((_, i) => (
					<p key={i} className="ml-12.5">
						Launch your token · Memecoins · Utility tokens · DAO tokens · Reward
						tokens · DeFi · Vara Network
					</p>
				))}
			</Ticker>
		</Link>
	)
}
