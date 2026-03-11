'use client'

import { useAccount } from '@gear-js/react-hooks'
import { useEffect, useState } from 'react'

import { useAuth } from '@/lib/hooks/use-auth'
import { WalletModal } from '../wallet-new/components/wallet-modal'
import Link from 'next/link'

export type ClassNameProps = {
	balance?: string
}
type Props = {
	isWalletModalOpen?: boolean
	walletModalHandler?: (bool: boolean) => void
	className?: ClassNameProps
}

export function CreateButton({
	isWalletModalOpen,
	walletModalHandler,
	className,
}: Props) {
	const { setWalletAccount, setsAccountReadyAtom, walletAccount } = useAuth()
	const [isWallet, setIsWallet] = useState(false)

	const { account, isAccountReady } = useAccount()

	const [isModalOpen, setIsModalOpen] = useState(isWalletModalOpen || false)
	const openModal = () => walletModalHandler?.(true) || setIsModalOpen(true)
	const closeModal = () => setIsModalOpen(false)

	useEffect(() => {
		setWalletAccount(account)
	}, [account])

	useEffect(() => {
		setsAccountReadyAtom(isAccountReady)
	}, [isAccountReady])

	useEffect(() => {
		setIsWallet(!!account || !!walletAccount)
	}, [account, walletAccount])

	if (!isAccountReady) return null

	return (
		<>
			{isWallet ? (
				<div className="mt-10 md:mt-12">
					<Link href={'/tokens/create'} className="btn btn--primary">
						Create token
					</Link>
				</div>
			) : (
				<button className="btn btn--primary mt-10 md:mt-12" onClick={openModal}>
					Connect Wallet
				</button>
			)}

			<WalletModal
				onClose={closeModal}
				open={isModalOpen}
				setOpen={openModal}
			/>
		</>
	)
}
