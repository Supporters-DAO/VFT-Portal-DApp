import hero from '@/components/sections/homepage/assets/hero-t.svg'
import heroMobile from '@/components/sections/homepage/assets/hero-t-mobile.svg'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
	className?: string
}

export function HeroTokenator({ className }: Props) {
	return (
		<div
			className={cn(
				'absolute inset-y-0 -bottom-9 flex sm:-bottom-17 lg:-left-5.5',
				'[--h:447px] lg:[--h:784px]',
				'[--w:586px] lg:[--w:591px]',
				className
			)}
		>
			<div className="flex aspect-[586/447] max-h-[calc(min(100%,var(--h)))] max-w-[calc(min(100%,var(--w)))] self-end lg:aspect-[591/784]">
				<Image
					src={heroMobile}
					alt="Tokenator"
					width={586}
					height={447}
					className="h-full object-contain lg:hidden"
				/>
				<Image
					src={hero}
					alt="Tokenator"
					width={591}
					height={802}
					className="hidden h-full object-contain lg:block"
				/>
			</div>
		</div>
	)
}
