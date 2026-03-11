'use client'

import React, { useMemo, useState } from 'react'
import { HexString } from '@gear-js/api'

import { Input } from '@/components/ui/input'
import { BackButton } from '@/components/common/back-button'

import { useMessages } from '@/lib/sails/use-send-message-ft'
import { useFetchBalances } from '@/lib/hooks/use-fetch-balances'
import { useAuth } from '@/lib/hooks/use-auth'
import { Hero404 } from '../../404/hero'
import { useRouter } from 'next/navigation'
import { TooltipContainer } from '@/components/ui/tooltip'
import { Sprite } from '@/components/ui/sprite'
import { formatUnits, parseUnits } from '@/lib/utils'

export interface IToken {
	admins: HexString[]
	id: HexString
	name: string
	symbol: string
	createdBy: HexString
	decimals: number
}

type Props = {
	token: IToken
}

export const BurnCoin = ({ token }: Props) => {
	const router = useRouter()
	const { walletAccount } = useAuth()
	const [isPending, setIsPending] = useState(false)
	const { balances } = useFetchBalances(isPending)

	const [inputAmount, setInputAmount] = useState('')
	const sendMessage = useMessages()

	const { decimals } = token
	const tokenBalance = balances.find((b) => b.coin.id === token.id)?.balance
	const formattedBalance = formatUnits(BigInt(tokenBalance || '0'), decimals)
	const isAdmin = walletAccount?.decodedAddress === token.createdBy

	const value = useMemo(
		() => parseUnits(inputAmount || '0', decimals),
		[inputAmount, decimals]
	)

	if (!isAdmin) return <Hero404 />

	const onSendCoins = async () => {
		if (!value) return

		setIsPending(true)

		const sendMessageResult = await sendMessage('burn', token.id, {
			value: value.toString(),
			from: walletAccount.decodedAddress,
		}).finally(() => {
			setInputAmount('')
			setIsPending(false)
		})

		if (!sendMessageResult) return

		router.push(`/tokens/${token.id}`)
	}

	const disableBurnButton =
		!value ||
		value <= 0 ||
		isPending ||
		(tokenBalance && BigInt(tokenBalance) <= 0) ||
		(tokenBalance && value > BigInt(tokenBalance))

	return (
		<div className="ju my-10 flex items-start max-sm:flex-col">
			<BackButton />
			<div className="flex flex-col items-center gap-3 max-sm:w-full">
				<div className="flex items-center justify-between">
					<h1 className="text-primary text-[28px] max-sm:text-[16px]">Burn</h1>
				</div>

				<div className="bg-blue-light flex w-[660px] flex-col gap-6 rounded-[40px] p-10 max-sm:w-full max-sm:rounded-[20px] max-sm:px-4 max-sm:py-10">
					<h3 className="text-center uppercase">{token.name}</h3>
					<p className="font-poppins text-primary text-center text-[16px] font-medium">
						{formattedBalance} {token.symbol}
					</p>

					<div className="font-poppins flex flex-col gap-3">
						<div className="">
							<div className="flex items-center gap-1">
								Amount
								<TooltipContainer
									trigger={
										<>
											<Sprite
												name="question"
												className="size-4 text-[#FDFDFD]/[40%]"
											/>
										</>
									}
									delay={0}
								>
									<p className="max-w-60 text-center">
										Сan`t be greater than total supply
									</p>
								</TooltipContainer>
							</div>
							<div className="flex gap-3">
								<Input
									label=""
									placeholder="Set amount"
									type="number"
									onChange={(e) => setInputAmount(e.target.value)}
									className="w-full"
									value={inputAmount || ''}
								/>
								{tokenBalance && (
									<button
										className="mt-1 rounded-lg bg-[#2E3B55] px-6 py-3"
										onClick={() => {
											setInputAmount(formattedBalance)
										}}
									>
										All
									</button>
								)}
							</div>
						</div>
					</div>
					<button
						className="btn mx-25 py-4 disabled:bg-[#D0D3D9] max-sm:mx-0 max-sm:w-full"
						disabled={!!disableBurnButton}
						onClick={onSendCoins}
					>
						{isPending ? (
							<span className="mx-auto flex w-1/2">
								Pending
								<span className="after:animate-dots w-full after:flex after:content-['']"></span>
							</span>
						) : (
							'Burn'
						)}
					</button>
				</div>
			</div>
		</div>
	)
}
