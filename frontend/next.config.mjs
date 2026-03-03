import BundleAnalyzer from '@next/bundle-analyzer'

import { createRequire } from 'node:module'

const withBundleAnalyzer = BundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})

const require = createRequire(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'standalone',
	webpack: (config) => {
		// fix for:
		// Module parse failed: 'import' and 'export' may appear only with 'sourceType: module'
		config.resolve.alias['@varan-wallet/varan-connect$'] =
			require.resolve('@varan-wallet/varan-connect')

		return config
	},

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
}

export default withBundleAnalyzer(nextConfig)
