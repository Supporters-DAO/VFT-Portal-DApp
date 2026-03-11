import About1x from '@/components/sections/homepage/assets/about.jpeg'
import About2x from '@/components/sections/homepage/assets/about@2x.jpg'
import About1xWebp from '@/components/sections/homepage/assets/about@2x.webp'
import About2xWebp from '@/components/sections/homepage/assets/about@2x.webp'
import Image from 'next/image'
import { AboutSplash } from '@/components/sections/homepage/about.splash'

type Props = {
	className?: string
}

export function About({}: Props) {
	return (
		<section
			className="flex flex-col sm:grid sm:min-h-screen sm:supports-[height:100svh]:min-h-svh lg:min-h-0 lg:grid-cols-2"
			id="about"
		>
			<div className="select-none">
				<picture>
					<source
						type="image/webp"
						srcSet={`${About1xWebp.src} 1x, ${About2xWebp.src} 2x`}
					/>
					<source
						type="image/jpeg"
						srcSet={`${About1x.src} 1x, ${About2x.src} 2x`}
					/>
					<Image
						src={About1x}
						alt="Tokenator"
						width={720}
						height={540}
						placeholder="blur"
						quality={100}
						className="aspect-[375/281px] size-full object-cover sm:aspect-[72/54]"
					/>
				</picture>
			</div>
			<div className="font-silkscreen relative order-first flex items-center justify-center text-[16px] leading-normal text-[#FDFDFD] sm:text-[18px] lg:order-last">
				<AboutSplash />
				<div className="m-auto p-4 pt-25 pb-20 sm:py-15 lg:p-5">
					<p className="max-w-[480px] text-center lg:text-left">
						Tokenator lets anyone deploy a Vara Fungible Token (VFT) on Vara
						Network in a few clicks. Memecoin, utility token, DAO token, reward
						program - you decide. The smart contract is deployed automatically,
						and full ownership belongs to you. The platform never holds any
						access to your token.
					</p>
				</div>
			</div>
		</section>
	)
}
