'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import React from 'react'
import { Hero404 } from '../sections/404/hero'

type Props = {
	children: React.ReactNode
}

export const WithAuthLayout = ({ children }: Props) => {
	const { walletAccount, isAccountReadyAtom } = useAuth()

	if (!isAccountReadyAtom) {
		return null
	}

	if (!walletAccount) {
		return <Hero404 />
	}

	return <div>{children}</div>
}
