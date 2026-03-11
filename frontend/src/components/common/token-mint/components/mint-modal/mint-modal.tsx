import React, { useMemo, useState } from 'react'

import { Sprite } from '@/components/ui/sprite'
import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { variantsOverlay, variantsPanel } from './mint-modal.variants'

import styles from './mint-modal.module.scss'
import { Input } from '@/components/ui/input'
import { useMessages } from '@/lib/sails/use-send-message-ft'
import { useAuth } from '@/lib/hooks/use-auth'
import { formatUnits, parseUnits } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Props = {
	onClose: () => void
	open: boolean
	id: `0x${string}`
	available: bigint
	decimals: number
}

export const MintModal = ({
	onClose,
	open,
	id,
	available,
	decimals,
}: Props) => {
	const { walletAccount } = useAuth()
	const router = useRouter()
	const [isPending, setIsPending] = useState(false)
	const [inputAmount, setInputAmount] = useState('')
	const sendMessage = useMessages()

	const value = useMemo(
		() => parseUnits(inputAmount || '0', decimals),
		[decimals, inputAmount]
	)

	const onMintTokens = async () => {
		if (!value || !walletAccount) return

		setIsPending(true)

		const sendMessageResult = await sendMessage('mint', id, {
			value: value.toString(),
			to: walletAccount.decodedAddress,
		}).finally(() => {
			setInputAmount('')
			setIsPending(false)
		})

		if (!sendMessageResult) return

		router.refresh()
		onClose()
	}

	const disableBurnButton =
		!value || value <= 0 || isPending || value > available

	return (
		<div>
			<AnimatePresence initial={false}>
				{open && (
					<Dialog
						as={motion.div}
						initial="closed"
						animate="open"
						exit="closed"
						static
						className={styles.modal}
						open={open}
						onClose={onClose}
					>
						<motion.div
							variants={variantsOverlay}
							className={styles.backdrop}
						/>

						<div className={styles.wrapper}>
							<div className={styles.container}>
								<Dialog.Panel
									as={motion.div}
									variants={variantsPanel}
									className={styles.modalContent}
								>
									<div className={styles.header}>
										<Dialog.Title as="h2" className={styles.title}>
											Mint tokens
										</Dialog.Title>
										<button className={styles.close} onClick={onClose}>
											<Sprite
												name="close"
												size={24}
												className={styles.svgIcon}
											/>
										</button>
									</div>
									<div className={styles.body}>
										<Input
											value={inputAmount}
											label="Amount"
											placeholder="Set amount"
											type="number"
											onChange={(e) => setInputAmount(e.target.value)}
										/>
										<div className={styles.available}>
											Available:
											<span className={styles.availableCount}>
												{formatUnits(available, decimals)}
											</span>
										</div>
									</div>
									<div className={styles.button}>
										<button
											className="btn w-full py-4 font-ps2p disabled:bg-[#D0D3D9]"
											disabled={disableBurnButton}
											onClick={onMintTokens}
										>
											{isPending ? (
												<span className="flex w-full">
													Pending
													<span className="w-full after:flex after:animate-dots after:content-['']"></span>
												</span>
											) : (
												'Mint'
											)}
										</button>
									</div>
								</Dialog.Panel>
							</div>
						</div>
					</Dialog>
				)}
			</AnimatePresence>
		</div>
	)
}
