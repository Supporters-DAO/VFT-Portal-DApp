'use client'

import { useAccount } from '@gear-js/react-hooks'
import { useEffect, useState } from 'react'

import { AccountButton } from '../account-button'
import { WalletModal } from '../wallet-modal'
import styles from './wallet.module.scss'
import { VaraBalance } from '@/components/common/wallet-new'
import { useAuth } from '@/lib/hooks/use-auth'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Sprite } from '@/components/ui/sprite'
import { useWallet } from '../../hooks'
import Link from 'next/link'

export type ClassNameProps = {
	balance?: string
}
type Props = {
	isWalletModalOpen?: boolean
	walletModalHandler?: (bool: boolean) => void
	className?: ClassNameProps
}

export function Wallet({
	isWalletModalOpen,
	walletModalHandler,
	className,
}: Props) {
	const {
		setWalletAccount,
		setsAccountReadyAtom,
		walletAccount,
		setIsLoadingWallet,
	} = useAuth()

	const { account, isAccountReady, logout } = useAccount()
	const { resetWalletId } = useWallet()

	const [isModalOpen, setIsModalOpen] = useState(isWalletModalOpen || false)
	const openModal = () => walletModalHandler?.(true) || setIsModalOpen(true)
	const closeModal = () => walletModalHandler?.(false) || setIsModalOpen(false)

	const [isOpenDropDown, setOpenDropDown] = useState(false)

	useEffect(() => {
		setWalletAccount(account)
	}, [account])

	useEffect(() => {
		setsAccountReadyAtom(isAccountReady)
	}, [isAccountReady])

	useEffect(() => {
		if (isAccountReady) {
			setIsLoadingWallet(false)
		}
	}, [isAccountReady])

	useEffect(() => {
		if (isWalletModalOpen !== undefined) {
			setIsModalOpen(isWalletModalOpen)
		}
	}, [isWalletModalOpen])

	if (!isAccountReady) return null

	const handleLogoutButtonClick = () => {
		logout()
		resetWalletId()
	}

	return (
		<>
			<div className={styles.wallet}>
				<VaraBalance className={className?.balance} />
				{account || walletAccount ? (
					<DropdownMenu open={isOpenDropDown} onOpenChange={setOpenDropDown}>
						<DropdownMenuTrigger asChild>
							<div className={styles.accountButton}>
								<AccountButton
									address={account?.address || walletAccount?.address}
									name={account?.meta.name || walletAccount?.meta.name}
									onClick={() => setOpenDropDown(!isOpenDropDown)}
									className="border-primary text-primary cursor-pointer rounded-lg border-2 bg-[#0F1B34] p-4 px-6 text-xs font-bold"
								/>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							side="bottom"
							className="font-poppins min-w-55 text-[14px] leading-none tracking-[0.03em] md:mt-2"
						>
							<DropdownMenuItem asChild className="text-[#FDFDFD]">
								<Link
									href={`https://vara.subscan.io/account/${account?.address}`}
									target="_blank"
									rel="noreferrer"
								>
									<div className="flex items-center gap-5">
										<Sprite name="cube" className="size-5" />
										<p>View in Vara Explorer</p>
									</div>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild className="text-[#FDFDFD]">
								<div className="flex items-center gap-5" onClick={openModal}>
									<Sprite name="user-switch" className="size-5" />
									<p>Change account</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild className="text-[#FDFDFD]">
								<div
									className="flex items-center gap-5"
									onClick={handleLogoutButtonClick}
								>
									<Sprite name="link-break" className="size-5" />
									<p>Disconnect</p>
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<button
						className="btn btn--outline text-primary min-h-11 p-4 text-[9px] leading-none sm:min-h-0 sm:text-xs md:px-6"
						onClick={openModal}
					>
						Connect Wallet
					</button>
				)}
			</div>

			<WalletModal
				onClose={closeModal}
				open={isModalOpen}
				setOpen={openModal}
			/>
		</>
	)
}
