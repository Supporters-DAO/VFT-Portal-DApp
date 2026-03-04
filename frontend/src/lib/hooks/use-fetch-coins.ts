import { useEffect, useState } from 'react'
import { HexString } from '@gear-js/api'
import { EXPLORER } from '@/lib/consts'

const endpoint = EXPLORER.BACK

export interface Token {
	description: string
	decimals: number
	distributed: string
	image: string
	id: `0x${string}`
	name: string
	symbol: string
	initialSupply: string
	maxSupply: string
	admins: HexString[]
	holders: string
	circulatingSupply: string
}

export const useFetchCoins = (limit = 20, offset = 0, searchQuery = '') => {
	const [totalCoins, setTotalCoins] = useState(0)
	const [tokenData, setTokenData] = useState<Token[]>([])

	const normalizedSearchQuery = searchQuery.trim()
	const hasSearchQuery = normalizedSearchQuery.length > 0
	const searchDefinition = hasSearchQuery ? ', $search: String!' : ''
	const whereClause = hasSearchQuery
		? ', where: { name_containsInsensitive: $search }'
		: ''

	const query = `query FetchCoins($limit: Int!, $offset: Int!${searchDefinition}) {
        coins(limit: $limit, offset: $offset, orderBy: id_ASC${whereClause}) {
            description
            decimals
            distributed
            image
            id
            name
            symbol
            initialSupply
            maxSupply
            admins
            holders
            circulatingSupply
        }
		coinsConnection(orderBy: id_ASC${whereClause}) {
			totalCount
		}
    }`
	const variables = hasSearchQuery
		? { limit, offset, search: normalizedSearchQuery }
		: { limit, offset }

	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query, variables }),
	}

	useEffect(() => {
		const fetchCoins = async () => {
			try {
				const response = await fetch(endpoint, options)
				const { data } = await response.json()

				setTotalCoins(data.coinsConnection.totalCount)
				setTokenData(data.coins)
			} catch (error) {
				console.error('Failed to fetch coins:', error)
			}
		}

		fetchCoins()
	}, [searchQuery, limit, offset])

	return { tokenData, totalCoins }
}
