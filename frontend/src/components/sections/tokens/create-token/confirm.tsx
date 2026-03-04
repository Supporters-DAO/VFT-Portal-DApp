'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useAtom } from 'jotai'

import { ICreateTokenForm } from './schema'
import { useAlert } from '@gear-js/react-hooks'
import { stepAtom } from '.'
import { Created } from './created'
import { cn, getGatewayUrl, parseUnits, uploadToIpfs } from '@/lib/utils'
import { useMessages } from '@/lib/sails/use-send-message-factory'
import { useAuth } from '@/lib/hooks/use-auth'

interface Props {
	data: ICreateTokenForm | undefined
}

export const ConfirmCreate = ({ data }: Props) => {
	const [isPending, setIsPending] = useState(false)
	const [, setStep] = useAtom(stepAtom)
	const [isCreated, setIsCreated] = useState(false)
	const [imageLink, setImageLink] = useState('')
	const { walletAccount } = useAuth()
	const sendMessage = useMessages()
	const alert = useAlert()

	const onCreate = async () => {
		setIsPending(true)
		if (!data) return

		let imageFile = data.image

		const [ipfsUrl] = await uploadToIpfs([imageFile])
		const linkIPFSImage = getGatewayUrl(ipfsUrl)
		setImageLink(linkIPFSImage)

		if (walletAccount && linkIPFSImage) {
			try {
				const decimals = data.decimals || 0

				// parsing here and not in the schema,
				// because the schema values are being set to come back to previous step
				const inititalSupply = parseUnits(
					data.initial_supply?.toString() || '0',
					decimals
				).toString()

				const maxSupply = parseUnits(
					data.max_supply?.toString() || '0',
					decimals
				).toString()

				const sendMessageResult = await sendMessage('createFungibleProgram', {
					name: data.name,
					symbol: data.symbol,
					decimals,
					description: data.description,
					external_links: {
						image: linkIPFSImage,
						website: data?.external_links?.website || null,
						telegram: data?.external_links?.telegram || null,
						twitter: data?.external_links?.twitter || null,
						discord: data?.external_links?.discord || null,
						tokenomics: data?.external_links?.tokenomics || null,
					},
					initial_supply: inititalSupply,
					max_supply: maxSupply,
					admin_id: walletAccount.decodedAddress,
				})

				if (sendMessageResult) {
					setIsCreated(true)
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : String(error)

				console.error('Error sending message:', error)
				alert.error('Error sending message: ' + errorMessage)
			} finally {
				setIsPending(false)
			}
		}
	}

	return (
		<div className="flex flex-col items-center gap-3 overflow-hidden">
			<h1 className="text-primary text-[28px] max-sm:text-center max-sm:text-[16px]">
				Create Token
			</h1>
			<div className="bg-blue-light flex w-[660px] flex-col gap-6 rounded-[40px] p-10 max-sm:w-full max-sm:rounded-[20px]">
				<div className="mx-auto w-2/5 max-sm:w-[70%]">
					<ol className="flex w-full items-center">
						<li className="after:border-primary flex w-full items-center text-[#0F1B34] after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:content-['']">
							<span className="bg-primary flex size-10 shrink-0 items-center justify-center rounded-full max-sm:size-7 max-sm:text-[12px]">
								1
							</span>
						</li>
						<li
							className={cn(
								"flex w-full items-center text-[#0F1B34] after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-[#D0D3D9] after:content-['']",
								isCreated && 'after:border-primary'
							)}
						>
							<span className="bg-primary flex size-10 shrink-0 items-center justify-center rounded-full max-sm:size-7 max-sm:text-[12px]">
								2
							</span>
						</li>
						<li className="flex w-0 items-center text-[#0F1B34] max-sm:w-auto">
							<span
								className={cn(
									'flex size-10 shrink-0 items-center justify-center rounded-full bg-[#D0D3D9] max-sm:size-7 max-sm:text-[12px]',
									isCreated && 'bg-primary'
								)}
							>
								3
							</span>
						</li>
					</ol>
				</div>
				{!isCreated ? (
					<>
						<h3 className="text-center uppercase">Confirm Details</h3>
						{data && (
							<div className="font-poppins flex flex-col gap-5 break-words">
								<div className="flex justify-center">
									<Image
										src={URL.createObjectURL(data.image)}
										alt={`Logo ${data.name}`}
										width={100}
										height={100}
										unoptimized={true}
										className="size-25 rounded-full object-cover"
										onError={(e) => {
											const target = e.target as HTMLImageElement
											target.onerror = null // prevents looping
											target.src = '/images/no-token.png'
										}}
									/>
								</div>

								<div className="flex justify-between">
									<div className="w-1/2">
										<span className="text-sm text-[#A4AAB6]">Name/Symbol</span>
										<p>
											{data.name}
											<span className="text-sm opacity-80"> {data.symbol}</span>
										</p>
									</div>

									<div className="w-1/2">
										<span className="text-sm text-[#A4AAB6]">Decimals</span>
										<p>{data.decimals}</p>
									</div>
								</div>

								<div className="flex justify-between">
									<div className="w-1/2">
										<span className="text-sm text-[#A4AAB6]">
											Initial Supply
										</span>
										<p>{data.initial_supply?.toLocaleString('us')}</p>
									</div>

									<div className="w-1/2">
										<span className="text-sm text-[#A4AAB6]">Max Supply</span>
										<p>{data.max_supply?.toLocaleString('us')}</p>
									</div>
								</div>

								{(data.external_links.website ||
									data.external_links.twitter) && (
									<div className="flex justify-between max-sm:flex-col">
										{data.external_links.website && (
											<div className="w-1/2 max-sm:w-full">
												<span className="text-sm text-[#A4AAB6]">Website</span>
												<p className="">{data.external_links.website}</p>
											</div>
										)}

										{data.external_links.twitter && (
											<div className="w-1/2 max-sm:w-full">
												<span className="text-sm text-[#A4AAB6]">Twitter</span>
												<p>{data.external_links.twitter}</p>
											</div>
										)}
									</div>
								)}

								{(data.external_links.telegram ||
									data.external_links.discord) && (
									<div className="flex justify-between max-sm:flex-col">
										{data.external_links.website && (
											<div className="w-1/2 max-sm:w-full">
												<span className="text-sm text-[#A4AAB6]">Telegram</span>
												<p>{data.external_links.telegram}</p>
											</div>
										)}

										{data.external_links.discord && (
											<div className="w-1/2 max-sm:w-full">
												<span className="text-sm text-[#A4AAB6]">Discord</span>
												<p>{data.external_links.discord}</p>
											</div>
										)}
									</div>
								)}

								<div className="break-words">
									<span className="text-sm text-[#A4AAB6]">Description</span>
									<p>{data.description}</p>
								</div>
							</div>
						)}

						<div className="mt-7 flex gap-3">
							<button
								className="mx-auto w-full rounded-lg bg-[#0F1B34] py-3 text-white max-sm:text-[3vw]"
								onClick={() => setStep('create')}
								disabled={isPending}
							>
								Back
							</button>
							<button
								className="bg-primary mx-auto w-full rounded-lg py-3 text-black disabled:bg-[#D0D3D9]"
								onClick={onCreate}
								disabled={isPending}
							>
								{isPending ? (
									<span className="mx-auto flex w-1/2 max-sm:w-4/5 max-sm:text-[3vw]">
										Pending
										<span className="after:animate-dots w-full after:flex after:content-['']"></span>
									</span>
								) : (
									'Confirm'
								)}
							</button>
						</div>
					</>
				) : (
					<Created name={data!.name} image={imageLink} />
				)}
			</div>
		</div>
	)
}
