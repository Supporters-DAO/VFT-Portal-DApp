import { useEffect, useState } from 'react'
import { HexString } from '@gear-js/api'
import { EXPLORER } from '@/lib/consts'
import { useAuth } from './use-auth'
import { IToken } from '@/components/sections/tokens/single-token/single-token'

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

export const useFetchToken = (id: string, trigger?: boolean) => {
	const [token, setToken] = useState<IToken>()
	const { walletAccount } = useAuth()

	const query = `query TokenById($id: String!) {
        coinById(id: $id) {
            description
            decimals
            distributed
            image
            id
            name
            symbol
			telegram
			twitter
			website
			discord
			tokenomics
			initialSupply
			maxSupply
			createdBy
			minted
			burned
			circulatingSupply
			holders
          }
      }`

	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query, variables: { id } }),
	}

	useEffect(() => {
		const fetchToken = async () => {
			try {
				const res = await fetch(EXPLORER.BACK, {
					...options,
					cache: 'no-store',
					next: { revalidate: 1 },
				})

				if (!res.ok) {
					// This will activate the closest `error.js` Error Boundary
					throw new Error('Failed to fetch data')
				}

				return res.json()
			} catch (error) {
				console.error('Failed to fetch coins:', error)
			}
		}

		const getTokenData = async () => {
			const data = await fetchToken()

			setToken(data.data.coinById)
		}

		getTokenData()
	}, [walletAccount, trigger])

	return { token }
}
