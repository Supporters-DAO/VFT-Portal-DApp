import { cn } from '@/lib/utils'
import * as React from 'react'

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

type InputComponentProps = InputProps & {
	ref?: React.Ref<HTMLInputElement>
}

export function Input({ className, ref, ...props }: InputComponentProps) {
	return <input className={cn('', className)} ref={ref} {...props} />
}
Input.displayName = 'Input'
