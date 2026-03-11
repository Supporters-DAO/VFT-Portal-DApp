/* eslint-disable */

import {
	CodeId,
	ActorId,
	TransactionBuilder,
	QueryBuilder,
	getServiceNamePrefix,
	getFnNamePrefix,
	ZERO_ADDRESS,
} from 'sails-js'
import { GearApi, BaseGearProgram, HexString } from '@gear-js/api'
import { TypeRegistry } from '@polkadot/types'

export interface InitConfigFactory {
	meme_code_id: CodeId
	factory_admin_account: Array<ActorId>
	gas_for_program: number | string | bigint
	gas_for_reply_deposit: number | string | bigint
}

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

export interface MemeRecord {
	name: string
	symbol: string
	decimals: number
	meme_program_id: ActorId
	admins: Array<ActorId>
}

export class SailsProgram {
	public readonly registry: TypeRegistry
	public readonly memeFactory: MemeFactory
	private _program?: BaseGearProgram

	constructor(
		public api: GearApi,
		programId?: `0x${string}`
	) {
		const types: Record<string, any> = {
			InitConfigFactory: {
				meme_code_id: '[u8;32]',
				factory_admin_account: 'Vec<[u8;32]>',
				gas_for_program: 'u64',
				gas_for_reply_deposit: 'u64',
			},
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
			MemeRecord: {
				name: 'String',
				symbol: 'String',
				decimals: 'u8',
				meme_program_id: '[u8;32]',
				admins: 'Vec<[u8;32]>',
			},
		}

		this.registry = new TypeRegistry()
		this.registry.setKnownTypes({ types })
		this.registry.register(types)
		if (programId) {
			this._program = new BaseGearProgram(programId, api)
		}

		this.memeFactory = new MemeFactory(this)
	}

	public get programId(): `0x${string}` {
		if (!this._program) throw new Error(`Program ID is not set`)
		return this._program.id
	}

	newCtorFromCode(
		code: Uint8Array | Buffer | HexString,
		config: InitConfigFactory
	): TransactionBuilder<null> {
		const builder = new TransactionBuilder<null>(
			this.api,
			this.registry,
			'upload_program',
			null,
			'New',
			config,
			'InitConfigFactory',
			'String',
			code,
			async (programId) => {
				this._program = await BaseGearProgram.new(programId, this.api)
			}
		)
		return builder
	}

	newCtorFromCodeId(codeId: `0x${string}`, config: InitConfigFactory) {
		const builder = new TransactionBuilder<null>(
			this.api,
			this.registry,
			'create_program',
			null,
			'New',
			config,
			'InitConfigFactory',
			'String',
			codeId,
			async (programId) => {
				this._program = await BaseGearProgram.new(programId, this.api)
			}
		)
		return builder
	}
}

export class MemeFactory {
	constructor(private _program: SailsProgram) {}

	public addAdminToFactory(admin_actor_id: ActorId): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'MemeFactory',
			'AddAdminToFactory',
			admin_actor_id,
			'[u8;32]',
			'Null',
			this._program.programId
		)
	}

	public createFungibleProgram(init: Init): TransactionBuilder<ActorId> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<ActorId>(
			this._program.api,
			this._program.registry,
			'send_message',
			'MemeFactory',
			'CreateFungibleProgram',
			init,
			'Init',
			'[u8;32]',
			this._program.programId
		)
	}

	public removeMeme(
		meme_id: number | string | bigint
	): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'MemeFactory',
			'RemoveMeme',
			meme_id,
			'u64',
			'Null',
			this._program.programId
		)
	}

	public updateCodeId(new_code_id: CodeId): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'MemeFactory',
			'UpdateCodeId',
			new_code_id,
			'[u8;32]',
			'Null',
			this._program.programId
		)
	}

	public updateGasForProgram(
		new_gas_amount: number | string | bigint
	): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'MemeFactory',
			'UpdateGasForProgram',
			new_gas_amount,
			'u64',
			'Null',
			this._program.programId
		)
	}

	public updateGasForReplyDeposit(
		new_gas_amount: number | string | bigint
	): TransactionBuilder<null> {
		if (!this._program.programId) throw new Error('Program ID is not set')
		return new TransactionBuilder<null>(
			this._program.api,
			this._program.registry,
			'send_message',
			'MemeFactory',
			'UpdateGasForReplyDeposit',
			new_gas_amount,
			'u64',
			'Null',
			this._program.programId
		)
	}

	public admins(): QueryBuilder<Array<ActorId>> {
		return new QueryBuilder<Array<ActorId>>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'MemeFactory',
			'Admins',
			null,
			null,
			'Vec<[u8;32]>'
		)
	}

	public gasForProgram(): QueryBuilder<bigint> {
		return new QueryBuilder<bigint>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'MemeFactory',
			'GasForProgram',
			null,
			null,
			'u64'
		)
	}

	public idToAddress(): QueryBuilder<
		Array<[number | string | bigint, ActorId]>
	> {
		return new QueryBuilder<Array<[number | string | bigint, ActorId]>>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'MemeFactory',
			'IdToAddress',
			null,
			null,
			'Vec<(u64, [u8;32])>'
		)
	}

	public memNumber(): QueryBuilder<bigint> {
		return new QueryBuilder<bigint>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'MemeFactory',
			'MemNumber',
			null,
			null,
			'u64'
		)
	}

	public memeCodeId(): QueryBuilder<CodeId> {
		return new QueryBuilder<CodeId>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'MemeFactory',
			'MemeCodeId',
			null,
			null,
			'[u8;32]'
		)
	}

	public memeCoins(): QueryBuilder<
		Array<[ActorId, Array<[number | string | bigint, MemeRecord]>]>
	> {
		return new QueryBuilder<
			Array<[ActorId, Array<[number | string | bigint, MemeRecord]>]>
		>(
			this._program.api,
			this._program.registry,
			this._program.programId,
			'MemeFactory',
			'MemeCoins',
			null,
			null,
			'Vec<([u8;32], Vec<(u64, MemeRecord)>)>'
		)
	}

	public subscribeToMemeCreatedEvent(
		callback: (data: {
			meme_id: number | string | bigint
			meme_address: ActorId
			init: Init
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
					getServiceNamePrefix(payload) === 'MemeFactory' &&
					getFnNamePrefix(payload) === 'MemeCreated'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"meme_id":"u64","meme_address":"[u8;32]","init":"Init"})',
								message.payload
							)[2]
							.toJSON() as unknown as {
							meme_id: number | string | bigint
							meme_address: ActorId
							init: Init
						}
					)
				}
			}
		)
	}

	public subscribeToMemeRemovedEvent(
		callback: (data: {
			removed_by: ActorId
			meme_id: number | string | bigint
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
					getServiceNamePrefix(payload) === 'MemeFactory' &&
					getFnNamePrefix(payload) === 'MemeRemoved'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"removed_by":"[u8;32]","meme_id":"u64"})',
								message.payload
							)[2]
							.toJSON() as unknown as {
							removed_by: ActorId
							meme_id: number | string | bigint
						}
					)
				}
			}
		)
	}

	public subscribeToGasUpdatedSuccessfullyEvent(
		callback: (data: {
			updated_by: ActorId
			new_gas_amount: number | string | bigint
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
					getServiceNamePrefix(payload) === 'MemeFactory' &&
					getFnNamePrefix(payload) === 'GasUpdatedSuccessfully'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"updated_by":"[u8;32]","new_gas_amount":"u64"})',
								message.payload
							)[2]
							.toJSON() as unknown as {
							updated_by: ActorId
							new_gas_amount: number | string | bigint
						}
					)
				}
			}
		)
	}

	public subscribeToCodeIdUpdatedSuccessfullyEvent(
		callback: (data: {
			updated_by: ActorId
			new_code_id: CodeId
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
					getServiceNamePrefix(payload) === 'MemeFactory' &&
					getFnNamePrefix(payload) === 'CodeIdUpdatedSuccessfully'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"updated_by":"[u8;32]","new_code_id":"[u8;32]"})',
								message.payload
							)[2]
							.toJSON() as unknown as {
							updated_by: ActorId
							new_code_id: CodeId
						}
					)
				}
			}
		)
	}

	public subscribeToAdminAddedEvent(
		callback: (data: {
			updated_by: ActorId
			admin_actor_id: ActorId
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
					getServiceNamePrefix(payload) === 'MemeFactory' &&
					getFnNamePrefix(payload) === 'AdminAdded'
				) {
					callback(
						this._program.registry
							.createType(
								'(String, String, {"updated_by":"[u8;32]","admin_actor_id":"[u8;32]"})',
								message.payload
							)[2]
							.toJSON() as unknown as {
							updated_by: ActorId
							admin_actor_id: ActorId
						}
					)
				}
			}
		)
	}
}
