import { Hero } from '@/components/sections/homepage/hero'
import { HomepageFAQ } from '@/components/sections/homepage/faq'
import { AllCoins } from '@/components/sections/homepage/all-coins'
import { CreateTokenBanner } from '@/components/banners/create-token'
import { About } from '@/components/sections/homepage/about'
import { AboutCreate } from '@/components/sections/homepage/about-create'

export default async function Page() {
	return (
		<>
			<Hero />
			<About />
			<AboutCreate />
			<div className="relative space-y-25 overflow-hidden bg-[#C3C5EA] pt-55 lg:pb-25">
				<AllCoins />
				<CreateTokenBanner />
			</div>
			<HomepageFAQ />
		</>
	)
}
