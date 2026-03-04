import { notFound } from 'next/navigation'

import { BurnCoin } from '@/components/sections/tokens/burn/burn'
import { EXPLORER } from '@/lib/consts'
import { HexString } from '@gear-js/api'

async function getData(id: string) {
	const query = `query TokenById($id: String!) {
        coinById(id: $id) {
			admins
			decimals
			id
			name
			symbol
			createdBy
          }
      }`

	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query, variables: { id } }),
	}

	try {
		const res = await fetch(EXPLORER.BACK, options)
		if (!res.ok) {
			throw new Error('Failed to fetch data')
		}
		return await res.json()
	} catch (error) {
		console.error('Error fetching data:', error)
		throw error // Re-throw to handle it in the calling context
	}
}

type ITokenResponse = {
	data: {
		coinById: {
			admins: HexString[]
			decimals: number
			id: HexString
			name: string
			symbol: string
			createdBy: HexString
		}
	}
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params

	const { id } = params

	const data = (await getData(id)) as ITokenResponse

	if (!data || !data.data.coinById) return notFound()

	const {
		data: { coinById },
	} = data

	return (
		<div className="container">
			<BurnCoin token={coinById} />
		</div>
	)
}
