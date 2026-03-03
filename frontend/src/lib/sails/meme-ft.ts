/* eslint-disable */

import {
	ActorId,
	TransactionBuilder,
	QueryBuilder,
	getServiceNamePrefix,
	getFnNamePrefix,
	ZERO_ADDRESS,
} from 'sails-js'
import { GearApi, BaseGearProgram, HexString } from '@gear-js/api'
import { TypeRegistry } from '@polkadot/types'

export interface Init {
	name: string
	symbol: string
	decimals: number
	description: string
	external_links: ExternalLinks
	initial_supply: number | string | bigint
	max_supply: number | string | bigint
	admin_id: ActorId
}

export interface ExternalLinks {
	image: string
	website: string | null
	telegram: string | null
	twitter: string | null
	discord: string | null
	tokenomics: string | null
}

export class SailsProgram {
	public readonly registry: TypeRegistry
	public readonly vft: Vft
	private _program?: BaseGearProgram

	constructor(
		public api: GearApi,
		programId?: `0x${string}`
	) {
		const types: Record<string, any> = {
			Init: {
				name: 'String',
				symbol: 'String',
				decimals: 'u8',
				description: 'String',
				external_links: 'ExternalLinks',
				initial_supply: 'U256',
				max_supply: 'U256',
				admin_id: '[u8;32]',
			},
			ExternalLinks: {
				image: 'String',
				website: 'Option<String>',
				telegram: 'Option<String>',
				twitter: 'Option<String>',
				discord: 'Option<String>',
				tokenomics: 'Option<String>',
			},
		}

		this.registry = new TypeRegistry()
		this.registry.setKnownTypes({ types })
		this.registry.register(types)
		if (programId) {
			this._program = new BaseGearProgram(programId, api)
		}

		this.vft = new Vft(this)
	}

	public get programId(): `0x${string}` {
		if (!this._program) throw new Error(`Program ID is not set`)
		return this._program.id
	}

	newCtorFromCode(
		code: Uint8Array | HexString,
		init: Init
	): TransactionBuilder<null> {
		const builder = new TransactionBuilder<null>(
			this.api,
			this.registry,
			'upload_program',
			null,
			'New',
			init,
			'Init',
			'String',
			code,
			async (programId) => {
				this._program = await BaseGearProgram.new(programId, this.api)
			}
		)
		return builder
	}

	newCtorFromCodeId(codeId: `0x${string}`, init: Init) {
		const builder = new TransactionBuilder<null>(
			this.api,
			this.registry,
			'create_program',
			null,
			'New',
			init,
			'Init',
			'String',
			codeId,
			async (programId) => {
				this._program = await BaseGearProgram.new(programId, this.api)
			}
		)
		return builder
	}
}

export class Vft {
	constructor(private _program: SailsProgram) {}

	public burn(
		$from: ActorId,
		value: number | string | bigint
	): TransactionBuilder<boolean> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<boolean>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'Burn',
			[$from, value],
			'([u8;32], U256)',
			'bool',
			this._program.programId
		)
	}

	public changeDescription(new_description: string): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'ChangeDescription',
			new_description,
			'String',
			'Null',
			this._program.programId
		)
	}

	public changeExternalLinks(
		new_external_links: ExternalLinks
	): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'ChangeExternalLinks',
			new_external_links,
			'ExternalLinks',
			'Null',
			this._program.programId
		)
	}

	public changeImageLink(new_image_link: string): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'ChangeImageLink',
			new_image_link,
			'String',
			'Null',
			this._program.programId
		)
	}

	public grantAdminRole(to: ActorId): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'GrantAdminRole',
			to,
			'[u8;32]',
			'Null',
			this._program.programId
		)
	}

	public grantBurnerRole(to: ActorId): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'GrantBurnerRole',
			to,
			'[u8;32]',
			'Null',
			this._program.programId
		)
	}

	public grantMinterRole(to: ActorId): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'GrantMinterRole',
			to,
			'[u8;32]',
			'Null',
			this._program.programId
		)
	}

	public kill(inheritor: ActorId): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'Kill',
			inheritor,
			'[u8;32]',
			'Null',
			this._program.programId
		)
	}

	public mint(
		to: ActorId,
		value: number | string | bigint
	): TransactionBuilder<boolean> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<boolean>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'Mint',
			[to, value],
			'([u8;32], U256)',
			'bool',
			this._program.programId
		)
	}

	public revokeAdminRole($from: ActorId): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'RevokeAdminRole',
			$from,
			'[u8;32]',
			'Null',
			this._program.programId
		)
	}

	public revokeBurnerRole($from: ActorId): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'RevokeBurnerRole',
			$from,
			'[u8;32]',
			'Null',
			this._program.programId
		)
	}

	public revokeMinterRole($from: ActorId): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'RevokeMinterRole',
			$from,
			'[u8;32]',
			'Null',
			this._program.programId
		)
	}

	public transferToUsers(
		to: Array<ActorId>,
		value: number | string | bigint
	): TransactionBuilder<boolean> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<boolean>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'TransferToUsers',
			[to, value],
			'(Vec<[u8;32]>, U256)',
			'bool',
			this._program.programId
		)
	}

	public approve(
		spender: ActorId,
		value: number | string | bigint
	): TransactionBuilder<boolean> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<boolean>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'Approve',
			[spender, value],
			'([u8;32], U256)',
			'bool',
			this._program.programId
		)
	}

	public transfer(
		to: ActorId,
		value: number | string | bigint
	): TransactionBuilder<boolean> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<boolean>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'Transfer',
			[to, value],
			'([u8;32], U256)',
			'bool',
			this._program.programId
		)
	}

	public transferFrom(
		$from: ActorId,
		to: ActorId,
		value: number | string | bigint
	): TransactionBuilder<boolean> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<boolean>(
			this._program.api,
			this._program.registry,
			'send_message',
			'Vft',
			'TransferFrom',
			[$from, to, value],
			'([u8;32], [u8;32], U256)',
			'bool',
			this._program.programId
		)
	}

	public admins(): QueryBuilder<Array<ActorId>> {
		return new QueryBuilder<Array<ActorId>>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'Vft',
			'Admins',
			null,
			null,
			'Vec<[u8;32]>'
		)
	}

	public burners(): QueryBuilder<Array<ActorId>> {
		return new QueryBuilder<Array<ActorId>>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'Vft',
			'Burners',
			null,
			null,
			'Vec<[u8;32]>'
		)
	}

	public description(): QueryBuilder<string> {
		return new QueryBuilder<string>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'Vft',
			'Description',
			null,
			null,
			'String'
		)
	}

	public externalLinks(): QueryBuilder<ExternalLinks> {
		return new QueryBuilder<ExternalLinks>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'Vft',
			'ExternalLinks',
			null,
			null,
			'ExternalLinks'
		)
	}

	public maxSupply(): QueryBuilder<bigint> {
		return new QueryBuilder<bigint>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'Vft',
			'MaxSupply',
			null,
			null,
			'U256'
		)
	}

	public minters(): QueryBuilder<Array<ActorId>> {
		return new QueryBuilder<Array<ActorId>>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'Vft',
			'Minters',
			null,
			null,
			'Vec<[u8;32]>'
		)
	}

	public allowance(owner: ActorId, spender: ActorId): QueryBuilder<bigint> {
		return new QueryBuilder<bigint>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'Vft',
			'Allowance',
			[owner, spender],
			'([u8;32], [u8;32])',
			'U256'
		)
	}

	public balanceOf(account: ActorId): QueryBuilder<bigint> {
		return new QueryBuilder<bigint>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'Vft',
			'BalanceOf',
			account,
			'[u8;32]',
			'U256'
		)
	}

	public decimals(): QueryBuilder<number> {
		return new QueryBuilder<number>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'Vft',
			'Decimals',
			null,
			null,
			'u8'
		)
	}

	public name(): QueryBuilder<string> {
		return new QueryBuilder<string>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'Vft',
			'Name',
			null,
			null,
			'String'
		)
	}

	public symbol(): QueryBuilder<string> {
		return new QueryBuilder<string>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'Vft',
			'Symbol',
			null,
			null,
			'String'
		)
	}

	public totalSupply(): QueryBuilder<bigint> {
		return new QueryBuilder<bigint>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'Vft',
			'TotalSupply',
			null,
			null,
			'U256'
		)
	}

	public subscribeToMintedEvent(
		callback: (data: {
			to: ActorId
			value: number | string | bigint
		}) => void | Promise<void>
	): Promise<() => void> {
		return this._program.api.gearEvents.subscribeToGearEvent(
			'UserMessageSent',
			({ data: { message } }) => {
				if (
					!message.source.eq(this._program.programId) ||
					!message.destination.eq(ZERO_ADDRESS)
				) {
					return
				}

				const payload = message.payload.toHex()
				if (
					getServiceNamePrefix(payload) === 'Vft' &&
					getFnNamePrefix(payload) === 'Minted'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"to":"[u8;32]","value":"U256"})',
								message.payload
							)[2]
							.toJSON() as unknown as {
							to: ActorId
							value: number | string | bigint
						}
					)
				}
			}
		)
	}

	public subscribeToBurnedEvent(
		callback: (data: {
			from: ActorId
			value: number | string | bigint
		}) => void | Promise<void>
	): Promise<() => void> {
		return this._program.api.gearEvents.subscribeToGearEvent(
			'UserMessageSent',
			({ data: { message } }) => {
				if (
					!message.source.eq(this._program.programId) ||
					!message.destination.eq(ZERO_ADDRESS)
				) {
					return
				}

				const payload = message.payload.toHex()
				if (
					getServiceNamePrefix(payload) === 'Vft' &&
					getFnNamePrefix(payload) === 'Burned'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"from":"[u8;32]","value":"U256"})',
								message.payload
							)[2]
							.toJSON() as unknown as {
							from: ActorId
							value: number | string | bigint
						}
					)
				}
			}
		)
	}

	public subscribeToKilledEvent(
		callback: (data: { inheritor: ActorId }) => void | Promise<void>
	): Promise<() => void> {
		return this._program.api.gearEvents.subscribeToGearEvent(
			'UserMessageSent',
			({ data: { message } }) => {
				if (
					!message.source.eq(this._program.programId) ||
					!message.destination.eq(ZERO_ADDRESS)
				) {
					return
				}

				const payload = message.payload.toHex()
				if (
					getServiceNamePrefix(payload) === 'Vft' &&
					getFnNamePrefix(payload) === 'Killed'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"inheritor":"[u8;32]"})',
								message.payload
							)[2]
							.toJSON() as unknown as { inheritor: ActorId }
					)
				}
			}
		)
	}

	public subscribeToTransferredToUsersEvent(
		callback: (data: {
			from: ActorId
			to: Array<ActorId>
			value: number | string | bigint
		}) => void | Promise<void>
	): Promise<() => void> {
		return this._program.api.gearEvents.subscribeToGearEvent(
			'UserMessageSent',
			({ data: { message } }) => {
				if (
					!message.source.eq(this._program.programId) ||
					!message.destination.eq(ZERO_ADDRESS)
				) {
					return
				}

				const payload = message.payload.toHex()
				if (
					getServiceNamePrefix(payload) === 'Vft' &&
					getFnNamePrefix(payload) === 'TransferredToUsers'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"from":"[u8;32]","to":"Vec<[u8;32]>","value":"U256"})',
								message.payload
							)[2]
							.toJSON() as unknown as {
							from: ActorId
							to: Array<ActorId>
							value: number | string | bigint
						}
					)
				}
			}
		)
	}

	public subscribeToDescriptionChangedEvent(
		callback: (data: { new_description: string }) => void | Promise<void>
	): Promise<() => void> {
		return this._program.api.gearEvents.subscribeToGearEvent(
			'UserMessageSent',
			({ data: { message } }) => {
				if (
					!message.source.eq(this._program.programId) ||
					!message.destination.eq(ZERO_ADDRESS)
				) {
					return
				}

				const payload = message.payload.toHex()
				if (
					getServiceNamePrefix(payload) === 'Vft' &&
					getFnNamePrefix(payload) === 'DescriptionChanged'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"new_description":"String"})',
								message.payload
							)[2]
							.toJSON() as unknown as { new_description: string }
					)
				}
			}
		)
	}

	public subscribeToImageLinkChangedEvent(
		callback: (data: { new_image_link: string }) => void | Promise<void>
	): Promise<() => void> {
		return this._program.api.gearEvents.subscribeToGearEvent(
			'UserMessageSent',
			({ data: { message } }) => {
				if (
					!message.source.eq(this._program.programId) ||
					!message.destination.eq(ZERO_ADDRESS)
				) {
					return
				}

				const payload = message.payload.toHex()
				if (
					getServiceNamePrefix(payload) === 'Vft' &&
					getFnNamePrefix(payload) === 'ImageLinkChanged'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"new_image_link":"String"})',
								message.payload
							)[2]
							.toJSON() as unknown as { new_image_link: string }
					)
				}
			}
		)
	}

	public subscribeToExternalLinksChangedEvent(
		callback: (data: {
			new_external_links: ExternalLinks
		}) => void | Promise<void>
	): Promise<() => void> {
		return this._program.api.gearEvents.subscribeToGearEvent(
			'UserMessageSent',
			({ data: { message } }) => {
				if (
					!message.source.eq(this._program.programId) ||
					!message.destination.eq(ZERO_ADDRESS)
				) {
					return
				}

				const payload = message.payload.toHex()
				if (
					getServiceNamePrefix(payload) === 'Vft' &&
					getFnNamePrefix(payload) === 'ExternalLinksChanged'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"new_external_links":"ExternalLinks"})',
								message.payload
							)[2]
							.toJSON() as unknown as { new_external_links: ExternalLinks }
					)
				}
			}
		)
	}

	public subscribeToApprovalEvent(
		callback: (data: {
			owner: ActorId
			spender: ActorId
			value: number | string | bigint
		}) => void | Promise<void>
	): Promise<() => void> {
		return this._program.api.gearEvents.subscribeToGearEvent(
			'UserMessageSent',
			({ data: { message } }) => {
				if (
					!message.source.eq(this._program.programId) ||
					!message.destination.eq(ZERO_ADDRESS)
				) {
					return
				}

				const payload = message.payload.toHex()
				if (
					getServiceNamePrefix(payload) === 'Vft' &&
					getFnNamePrefix(payload) === 'Approval'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"owner":"[u8;32]","spender":"[u8;32]","value":"U256"})',
								message.payload
							)[2]
							.toJSON() as unknown as {
							owner: ActorId
							spender: ActorId
							value: number | string | bigint
						}
					)
				}
			}
		)
	}

	public subscribeToTransferEvent(
		callback: (data: {
			from: ActorId
			to: ActorId
			value: number | string | bigint
		}) => void | Promise<void>
	): Promise<() => void> {
		return this._program.api.gearEvents.subscribeToGearEvent(
			'UserMessageSent',
			({ data: { message } }) => {
				if (
					!message.source.eq(this._program.programId) ||
					!message.destination.eq(ZERO_ADDRESS)
				) {
					return
				}

				const payload = message.payload.toHex()
				if (
					getServiceNamePrefix(payload) === 'Vft' &&
					getFnNamePrefix(payload) === 'Transfer'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"from":"[u8;32]","to":"[u8;32]","value":"U256"})',
								message.payload
							)[2]
							.toJSON() as unknown as {
							from: ActorId
							to: ActorId
							value: number | string | bigint
						}
					)
				}
			}
		)
	}
}
