'use client'

import React, { useMemo, useState } from 'react'
import { HexString, decodeAddress } from '@gear-js/api'

import { Input } from '@/components/ui/input'
import { isValidHexString, parseUnits } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useMessages } from '@/lib/sails/use-send-message-ft'

type Props = {
	id: HexString
	decimals: number
}

export const SendUser = ({ id, decimals }: Props) => {
	const router = useRouter()

	const [isPending, setIsPending] = useState(false)
	const [address, setAddress] = useState<string | HexString>()
	const [inputAmount, setInputAmount] = useState('')

	const value = useMemo(
		() => parseUnits(inputAmount || '0', decimals),
		[decimals, inputAmount]
	)

	const sendMessage = useMessages()

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddress(e.target.value as string)
	}

	const onSendCoins = async () => {
		if (!address || !value || !isValidHexString(decodeAddress(address))) return

		setIsPending(true)
		const sendMessageResult = await sendMessage('transfer', id, {
			value: value.toString(),
			to: decodeAddress(address),
		}).finally(() => setIsPending(false))

		if (!sendMessageResult) return

		setAddress(undefined)
		setInputAmount('')
		router.push(`/tokens/${id}`)
	}

	return (
		<>
			<Input
				label=""
				value={address}
				placeholder="Add one address"
				onChange={handleInputChange}
			/>
			<div className="mt-3">
				<Input
					value={inputAmount}
					label="Amount"
					placeholder="Set amount"
					type="number"
					onChange={(e) => setInputAmount(e.target.value)}
				/>
			</div>
			<button
				className="btn mx-auto mt-5 w-1/2 py-4 font-ps2p disabled:bg-[#D0D3D9]"
				disabled={address?.length === 0 || !value || value <= 0 || isPending}
				onClick={onSendCoins}
			>
				{isPending ? (
					<span className="mx-auto flex w-max">
						Pending
						<span className="w-6 after:flex after:animate-dots after:content-['']"></span>
					</span>
				) : (
					'Send'
				)}
			</button>
		</>
	)
}
