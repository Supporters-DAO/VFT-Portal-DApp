import { Sprite } from '@/components/ui/sprite'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/use-auth'

type Props = {
	className?: string
}

export function HeaderMenu({ className }: Props) {
	const { walletAccount } = useAuth()
	const [open, setOpen] = useState(false)
	const pathname = usePathname()

	return (
		<div className={cn('relative flex flex-col', className)}>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="link-primary -mr-2 inline-flex items-center p-2"
					>
						<Sprite name="header-menu" className="size-6" aria-hidden />
						<span className="sr-only">Mobile menu</span>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					side="bottom"
					className="min-w-55 font-poppins text-[14px] leading-none tracking-[0.03em] md:mt-2"
				>
					{walletAccount && (
						<>
							<DropdownMenuItem
								asChild
								className={cn(pathname === '/tokens/create' && 'text-primary')}
							>
								<Link href="/tokens/create">Create Token</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />

							<DropdownMenuItem
								asChild
								className={cn(pathname === '/tokens/my' && 'text-primary')}
							>
								<Link href="/tokens/my">My Tokens</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
						</>
					)}
					<DropdownMenuItem
						asChild
						className={cn(pathname === '/tokens' && 'text-primary')}
					>
						<Link href="/tokens">All Tokens</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link
							href="https://app.rivrdex.com"
							target="_blank"
							rel="noreferrer"
						>
							List on RivrDEX
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
