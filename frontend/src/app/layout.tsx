import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Silkscreen, Poppins, Press_Start_2P } from 'next/font/google'
import Script from 'next/script'
import { Header } from '@/components/layouts/base/header'
import { ReactNode } from 'react'
import { GearApiProvider } from '@/components/providers/gear-api'

const GTM_ID = 'GTM-PRHTXR49'

const silkscreen = Silkscreen({
	display: 'swap',
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-silkscreen',
})

const pressStart2P = Press_Start_2P({
	display: 'swap',
	subsets: ['latin'],
	weight: ['400'],
	variable: '--font-ps2p',
})

const poppins = Poppins({
	display: 'swap',
	subsets: ['latin'],
	weight: ['400', '600'],
	variable: '--font-poppins',
})
const siteConfig = {
	name: 'Tokenator',
}

export const metadata: Metadata = {
	title: {
		default: 'Tokenator - Launch Any Token on Vara',
		template: `%s | ${siteConfig.name}`,
	},
	description:
		'Deploy any fungible token on Vara Network in minutes - no code needed. Memecoins, utility tokens, DAO tokens, rewards. Free to launch, list on RivrDEX.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html
			lang="en"
			className={`${silkscreen.variable} ${poppins.variable} ${pressStart2P.variable}`}
		>
			<head>
				<Script id="gtm" strategy="afterInteractive">
					{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
				</Script>
			</head>
			<body className="flex min-h-screen flex-col font-ps2p [--header-height:5.625rem] sm:[--header-height:4.375rem] lg:[--header-height:6.25rem]">
				<noscript>
					<iframe
						src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
						height="0"
						width="0"
						style={{ display: 'none', visibility: 'hidden' }}
					/>
				</noscript>
				<GearApiProvider>
					<Header />
				</GearApiProvider>
				{children}
			</body>
		</html>
	)
}
