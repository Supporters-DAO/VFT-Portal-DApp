import BundleAnalyzer from '@next/bundle-analyzer'

import { createRequire } from 'node:module'

const withBundleAnalyzer = BundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})

const require = createRequire(import.meta.url)

if (!process.env.NEXT_PUBLIC_IPFS_GETAWAY) {
	throw new Error('NEXT_PUBLIC_IPFS_GETAWAY must be set')
}

const gatewayUrl = new URL(process.env.NEXT_PUBLIC_IPFS_GETAWAY)

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
				protocol: gatewayUrl.protocol.replace(':', ''),
				hostname: gatewayUrl.hostname,
				port: gatewayUrl.port || undefined,
				pathname: `${gatewayUrl.pathname.replace(/\/$/, '') || ''}/**`,
			},
		],
	},
}

export default withBundleAnalyzer(nextConfig)
