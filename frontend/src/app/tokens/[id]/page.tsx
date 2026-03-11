import {
	Token,
	type IToken,
} from '@/components/sections/tokens/single-token/single-token'
import { notFound } from 'next/navigation'
import { EXPLORER } from '@/lib/consts'

async function getData(id: string) {
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

	const res = await fetch(EXPLORER.BACK, {
		...options,
		cache: 'no-store',
		next: { tags: ['balance', 'token'] },
	})

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch data')
	}

	return res.json()
}

type ITokenResponse = {
	data: {
		coinById: IToken
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
			<Token token={coinById} />
		</div>
	)
}
