import { atom, useAtom } from 'jotai'
import { Account } from '@gear-js/react-hooks'

export const walletAccountAtom = atom<Account | undefined>(undefined)
export const accountReadyAtom = atom<boolean>(false)
export const adminAtom = atom<boolean>(false)
export const isLoadingAtomWallet = atom<boolean>(true)

export const useAuth = () => {
	const [walletAccount, setWalletAccount] = useAtom(walletAccountAtom)
	const [isAccountReadyAtom, setsAccountReadyAtom] = useAtom(accountReadyAtom)
	const [isLoadingWallet, setIsLoadingWallet] = useAtom(isLoadingAtomWallet)

	return {
		walletAccount,
		isAccountReadyAtom,
		isLoadingWallet,
		setWalletAccount,
		setsAccountReadyAtom,
		setIsLoadingWallet,
	}
}

export const useAuthAdmin = () => {
	const [isAdmin, setIsAdmin] = useAtom(adminAtom)

	return {
		isAdmin,
		setIsAdmin,
	}
}
