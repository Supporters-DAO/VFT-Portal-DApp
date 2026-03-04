import { z } from 'zod'
import { IGQLRequestWrapper } from '@/lib/types'

const lastCoinSchema = z.object({
	id: z.string(),
	name: z.string(),
	timestamp: z.iso.datetime(),
	image: z.url(),
	distributed: z.string(),
	maxSupply: z.string(),
	symbol: z.string(),
})

const lastCoinsSchema = z.object({
	coins: lastCoinSchema.array().nullable(),
})

export type ILastCoin = z.infer<typeof lastCoinSchema>
export type ILastCoins = z.infer<typeof lastCoinsSchema>

export const getLastCoinsQuery = `{
		coins(limit: 10, offset: 0, orderBy: timestamp_DESC) {
			id
			decimals
			name
			timestamp
			image
			distributed
			maxSupply
			symbol
		}
	}`

export type ILastCoinsResponse = IGQLRequestWrapper<ILastCoins>
