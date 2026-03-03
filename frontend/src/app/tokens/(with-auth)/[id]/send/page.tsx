import { SendCoin } from '@/components/sections/tokens/send/send'
import { EXPLORER } from '@/lib/consts'
import { HexString } from '@gear-js/api'
import { notFound } from 'next/navigation'

async function getData(id: string) {
	const query = `{
        coinById(id: "${id}") {
			admins
			decimals
			id
			initialSupply
			maxSupply
			name
			symbol
          }
      }`

	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query: query }),
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
			initialSupply: string
			maxSupply: string
			name: string
			symbol: string
		}
	}
}

export default async function Page(
    props: {
        params: Promise<{ id: string }>
    }
) {
    const params = await props.params;

    const {
        id
    } = params;

    const data = (await getData(id)) as ITokenResponse

    if (!data || !data.data.coinById) return notFound()

    const {
		data: { coinById },
	} = data

    return (
		<div className="container">
			<SendCoin token={coinById} />
		</div>
	)
}
