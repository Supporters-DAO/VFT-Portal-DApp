import { ColumnDef } from '@tanstack/react-table'
import { type AlertContainerFactory, useAlert } from '@gear-js/react-hooks'
import Image from 'next/image'

import {
	copyToClipboard,
	formatDistributedPercentage,
	formatUnits,
	prettyWord,
} from '@/lib/utils'
import { getSafeImageSrc } from '@/lib/sanitize'
import { Sprite } from '@/components/ui/sprite'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Token } from '@/lib/hooks/use-fetch-my-coins'
import { Mint } from '@/components/common/token-mint'

const handleCopyClickAddress = async (
	address: string,
	alert?: AlertContainerFactory
) => {
	await copyToClipboard({ value: address, alert })
}

export const coinsTypesTableColumns: ColumnDef<Token>[] = [
	{
		accessorFn: (row) => row.image,
		id: 'image',
		cell: (info) => (
			<div className="relative flex flex-col items-center justify-center">
				<Image
					src={getSafeImageSrc(info?.row?.original?.image)}
					alt={info?.row?.original?.name}
					width={60}
					height={60}
					unoptimized={true}
					className="size-15 rounded-full object-cover"
					onError={(e) => {
						const target = e.target as HTMLImageElement
						target.onerror = null // prevents looping
						target.src = '/images/no-token.png'
					}}
				/>
				{info?.row?.original?.isAdmin && (
					<p className="font-ps2p -m-2 w-max rounded-sm bg-white p-1 text-[8px] text-black uppercase">
						Creator
					</p>
				)}
			</div>
		),
		header: 'Image',
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.name,
		id: 'name',
		cell: (info) => (
			<div className="flex h-full flex-col">{info.row.original.name}</div>
		),
		header: () => <div className="group flex items-center">Name</div>,
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.symbol,
		id: 'symbol',
		cell: (info) => (
			<div className="text-center">{info.row.original.symbol}</div>
		),
		header: () => (
			<div className="group flex items-center justify-center">Symbol</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.initialSupply,
		id: 'initialSupply',
		cell: (info) => (
			<div className="text-right">
				{formatUnits(
					BigInt(info.row.original.initialSupply),
					info.row.original.decimals
				)}
			</div>
		),
		header: () => (
			<div className="group flex items-center justify-end">Initial Supply</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.maxSupply,
		id: 'maxSupply',
		cell: (info) => (
			<div className="text-right">
				{formatUnits(
					BigInt(info.row.original.maxSupply),
					info.row.original.decimals
				)}
			</div>
		),
		header: () => (
			<div className="group flex items-center justify-end">Max Supply</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.circulatingSupply,
		id: 'circulatingSupply',
		cell: (info) => (
			<div className="text-right">
				{formatUnits(
					BigInt(info.row.original.circulatingSupply),
					info.row.original.decimals
				)}
			</div>
		),
		header: () => (
			<div className="group flex items-center justify-center">Total Supply</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.distributed,
		id: 'distributed',
		cell: (info) => (
			<div className="text-right">
				{formatDistributedPercentage(
					info.row.original.distributed,
					info.row.original.maxSupply
				)}
				%
			</div>
		),
		header: () => (
			<div className="group flex items-center justify-end">Distributed</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.holders,
		id: 'holders',
		cell: (info) => (
			<div className="text-right">{info.row.original.holders}</div>
		),
		header: () => (
			<div className="group flex items-center justify-center">Holders</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.id,
		id: 'address',
		cell: (info) => TokenId(info.row.original.id),
		header: () => (
			<div className="group flex items-center justify-center">Address</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.id,
		id: 'Balance',
		cell: (info) => (
			<div className="flex items-center justify-center gap-3 text-center">
				{formatUnits(
					BigInt(info.row.original.balance),
					info.row.original.decimals
				)}
			</div>
		),
		header: () => (
			<div className="group flex items-center justify-center">Balance</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.id,
		id: 'buttons',
		header: () => <div className="items-right justify-right group flex"></div>,
		cell: (info) =>
			Buttons(
				info.row.original.isAdmin,
				info.row.original.id,
				BigInt(info.row.original.maxSupply) -
					BigInt(info.row.original.circulatingSupply),
				info.row.original.decimals
			),

		enableSorting: false,
	},
]

function TokenId(id: `0x${string}`) {
	const alert = useAlert()

	return (
		<div className="flex items-center justify-center gap-3 text-center">
			{prettyWord(id)}
			<button onClick={() => handleCopyClickAddress(id, alert)}>
				<Sprite name="copy" size={16} />
			</button>
		</div>
	)
}

function Buttons(
	isAdmin: boolean,
	id: `0x${string}`,
	availableMint: bigint,
	decimals: number
) {
	const [isOpenMintModal, setIsOpenMintModal] = useState(false)
	const [open, setOpen] = useState(false)
	const router = useRouter()

	return (
		<>
			<Mint
				isMintModalOpen={isOpenMintModal}
				available={availableMint}
				decimals={decimals}
				id={id}
				mintModalHandler={setIsOpenMintModal}
			/>

			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<button type="button" className="link-primary -mr-2 inline-flex">
						<Sprite name="more" color="white" className="size-6" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					side="bottom"
					className="font-poppins min-w-35 rounded-lg border-2 border-[#2E3B55] bg-[#1D2C4B] text-[14px] leading-none tracking-[0.03em] md:mt-2"
				>
					<DropdownMenuItem
						onClick={(e: { stopPropagation: () => void }) => {
							e.stopPropagation()
							router.push(`/tokens/${id}/send/`)
						}}
						className="flex gap-4"
					>
						<Sprite
							name="arrow-right-up"
							color="#FDFDFD/[30%]"
							className="size-5"
						/>
						Send
					</DropdownMenuItem>
					{isAdmin && (
						<>
							<DropdownMenuSeparator />
							{
								<DropdownMenuItem
									onClick={(e: { stopPropagation: () => void }) => {
										e.stopPropagation()
										setIsOpenMintModal(true)
									}}
									className="flex gap-4"
								>
									<Sprite
										name="coins"
										color="#FDFDFD/[30%]"
										className="size-5"
									/>
									Mint Tokens
								</DropdownMenuItem>
							}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={(e: { stopPropagation: () => void }) => {
									e.stopPropagation()
									router.push(`/tokens/${id}/burn/`)
								}}
								className="flex gap-4"
							>
								<Sprite name="fire" color="#FDFDFD/[30%]" className="size-5" />
								Burn
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
