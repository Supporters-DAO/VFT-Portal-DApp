'use client'

import { getSafeImageSrc } from '@/lib/sanitize'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useFetchCoins } from '@/lib/hooks/use-fetch-coins'
import { useDebounce } from '@/lib/hooks/use-debounce'

type Props = {
	className?: string
}

export function AllCoins({ className }: Props) {
	const [searchQuery, setSearchQuery] = useState('')
	const debouncedSearchQuery = useDebounce(searchQuery, 1000)
	const { tokenData: coins } = useFetchCoins(10, 0, debouncedSearchQuery)

	return (
		<section
			className={cn(
				'container mx-auto w-full max-w-[608px] space-y-5 md:space-y-8',
				className
			)}
		>
			<h2 className="text-center text-[22px] leading-none text-[#242424] sm:text-[32px]">
				All tokens
			</h2>
			<div>
				<input
					type="text"
					className="font-silkscreen block w-full rounded-lg bg-[#0F1B34]/[4%] px-6 py-3 text-[16px]/5 text-[#242424] ring-2 ring-[#0F1B34]/[6%] select-none ring-inset placeholder:text-[#242424]/70 focus:outline-none"
					placeholder="Search"
					onChange={(event) => setSearchQuery(event.target.value.trim())}
				/>
			</div>
			<div className="">
				<ul className="space-y-2 md:space-y-4">
					{coins?.map((coin, i) => (
						<li key={coin.id}>
							<Link
								href={`/tokens/${coin.id}`}
								className="ring-primary hocus:ring-4 flex items-center space-x-3 rounded-lg bg-[#FDFDFD] py-2 pr-6 pl-5 ring-2 transition-shadow select-none ring-inset md:space-x-10 md:rounded-2xl"
							>
								<div className="relative size-10 overflow-hidden rounded-full md:size-25">
									<Image
										src={getSafeImageSrc(coin.image)}
										alt="Coin Image"
										fill
										unoptimized={true}
										className="object-cover"
										onError={(e) => {
											const target = e.target as HTMLImageElement
											target.onerror = null // prevents looping
											target.src = '/images/no-token.png'
										}}
									/>
								</div>
								<div className="grow space-y-1 md:space-y-3">
									<h3 className="flex items-center space-x-4 text-[14px]/[22px] text-[#242424] md:text-[20px]/[22px]">
										<span>{coin.name}</span>{' '}
										<span className="font-silkscreen inline-flex text-[12px]/[22px] opacity-80 md:text-[18px]/[1.4]">
											{coin.symbol}
										</span>
									</h3>
									<p className="font-silkscreen text-[12px]/[15px] text-[#8B2786] md:text-[18px]/[1.4]">
										Distributed:{' '}
										{(
											(BigInt(coin.distributed) * BigInt(100)) /
											BigInt(coin.maxSupply)
										).toString()}
										%
									</p>
								</div>
								<div className="size-6 md:size-8">
									<Image
										src="/images/coin.gif"
										alt={coin.symbol}
										width={32}
										height={32}
										className="size-full"
									/>
								</div>
							</Link>
						</li>
					))}
				</ul>
				<div className="mt-4 md:mt-6">
					<Link href="/tokens" className="btn btn--white w-full">
						Browse all tokens
					</Link>
				</div>
			</div>
		</section>
	)
}
