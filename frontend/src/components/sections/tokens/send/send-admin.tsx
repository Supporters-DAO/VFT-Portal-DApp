'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { HexString, decodeAddress } from '@gear-js/api'

import { Sprite } from '@/components/ui/sprite'
import { ScrollArea } from '@/components/common/scroll-area'
import { Input } from '@/components/ui/input'
import { isValidHexString, parseUnits } from '@/lib/utils'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { useMessages } from '@/lib/sails/use-send-message-ft'

type Props = {
	id: HexString
	tokenBalance: string
	decimals: number
}

export const SendAdmin = ({ id, tokenBalance, decimals }: Props) => {
	const { walletAccount } = useAuth()
	const router = useRouter()

	const sendMessage = useMessages()

	const [isPending, setIsPending] = useState(false)
	const [addresses, setAddresses] = useState<HexString[]>([])
	const [inputValue, setInputValue] = useState<HexString | ''>('')
	const [inputAmount, setInputAmount] = useState('')

	const value = useMemo(
		() => parseUnits(inputAmount || '0', decimals),
		[inputAmount, decimals]
	)

	const isScrollable = (addresses?.length || 0) > 6

	const textAreaRef = useRef<HTMLTextAreaElement>(null)
	const [parentHeight, setParentHeight] = useState('auto')

	useEffect(() => {
		setParentHeight(`${textAreaRef.current!.scrollHeight}px`)
	}, [inputValue])

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value
		setInputValue(value as HexString)

		const potentialAddresses = value.split(/\r?\n/)
		const newAddresses: HexString[] = []

		for (const addr of potentialAddresses) {
			try {
				if (
					isValidHexString(addr) ||
					(isValidHexString(decodeAddress(addr)) &&
						!addresses.includes(decodeAddress(addr)))
				) {
					newAddresses.push(decodeAddress(addr))
				}
			} catch (error) {
				// console.error('Error decoding address:', addr, error)
			}
		}

		if (newAddresses.length > 0) {
			setAddresses((prevAddresses: any) => {
				const updatedAddresses = new Set([...prevAddresses, ...newAddresses])
				return Array.from(updatedAddresses)
			})
		} else if (
			potentialAddresses.every(
				(addr) => !isValidHexString(addr) || !decodeAddress(addr)
			)
		) {
			setAddresses([])
		}

		const nonEmptyLines = potentialAddresses.filter(
			(addr) => addr.trim() !== ''
		)

		const newHeight =
			nonEmptyLines.length > 0 ? `${nonEmptyLines.length * 20}px` : 'auto'
		setParentHeight(newHeight)
	}

	const onSendCoins = async () => {
		if (!value || !walletAccount || value > BigInt(tokenBalance)) return

		setIsPending(true)

		const sendMessageResult = await sendMessage('transferToUsers', id, {
			value: value.toString(),
			toUsers: [...addresses],
		})

		if (!sendMessageResult) return setIsPending(false)

		setIsPending(false)
		setAddresses([])
		setInputAmount('')
		router.push(`/tokens/${id}`)
	}

	return (
		<>
			<div className="flex max-h-[354px] flex-col gap-2 rounded-lg border-2 border-[#2E3B55] bg-[#0F1B34]/[40%] px-4 py-3">
				<ScrollArea className="pr-4" type={isScrollable ? 'always' : undefined}>
					<div
						className="relative grid gap-2"
						style={{ minHeight: parentHeight }}
					>
						<Sprite name="enter" className="absolute right-0 bottom-0 size-4" />
						<textarea
							ref={textAreaRef}
							rows={1}
							style={{
								height: parentHeight,
							}}
							value={inputValue}
							placeholder="Add one or more addresses (use new lines for multiple addresses)"
							className="resize-none border-none bg-transparent text-[12px] leading-6 outline-none"
							onChange={handleInputChange}
						/>
					</div>
				</ScrollArea>
			</div>
			<span className="text-[13px]">Each address should be on a new line</span>
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
				className="btn font-ps2p mx-auto mt-5 flex w-full justify-center py-4 disabled:bg-[#D0D3D9]"
				disabled={
					addresses.length === 0 ||
					!value ||
					value <= 0 ||
					isPending ||
					!(value <= BigInt(tokenBalance))
				}
				onClick={onSendCoins}
			>
				{isPending ? (
					<span className="mx-auto flex w-max">
						Pending
						<span className="after:animate-dots w-6 after:flex after:content-['']"></span>
					</span>
				) : (
					'Send'
				)}
			</button>
		</>
	)
}
