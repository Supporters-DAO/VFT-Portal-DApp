import { HexString } from '@gear-js/api'

const publicEnv = (value: string | undefined, fallback: string) =>
	value && value.trim() ? value : fallback

export const ADDRESS = {
	NODE: publicEnv(
		process.env.NEXT_PUBLIC_NODE_ADDRESS,
		'wss://rpc.vara.network',
	),
	IPFS_UPLOAD: publicEnv(
		process.env.NEXT_PUBLIC_IPFS_UPLOAD_ADDRESS,
		'https://pinata-proxy.tokenator.club/files/upload',
	),
	IPFS_GETAWAY: publicEnv(
		process.env.NEXT_PUBLIC_IPFS_GETAWAY,
		'https://sapphire-advisory-bird-981.mypinata.cloud/ipfs',
	),
}

export const CONTRACT_ADDRESS = {
	ADDRESS: publicEnv(
		process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
		'0x729fa6dda815fd49bb4cae215a9904edd3c4d941ed51448eeca94ef2f69fd6a3',
	) as HexString,
}

export const EXPLORER = {
	BACK: publicEnv(
		process.env.NEXT_PUBLIC_EXPLORER,
		'https://explorer.tokenator.club/graphql',
	),
}
