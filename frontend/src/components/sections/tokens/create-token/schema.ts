import { z } from 'zod'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/gif',
]

const optionalHttpsUrl = z.url({ protocol: /^https$/ }).or(z.literal(''))

export const createTokenSchema = z
	.object({
		name: z
			.string()
			.regex(/^([A-Za-z ]+)$/, { message: 'Only Latin letters are allowed' })
			.min(2, { message: 'Name must be at least 2 characters' })
			.max(10, { message: 'Name must be no more than 10 characters' }),
		symbol: z
			.string()
			.regex(/^[A-Za-z]+$/, { message: 'Only Latin letters are allowed' })
			.min(2, { message: 'Symbol must be at least 2 characters long' })
			.max(8, { message: 'Symbol must be no more than 8 characters long' }),
		decimals: z.nullable(
			z
				.number()
				.min(1, { message: 'Min number of decimals is 1' })
				.max(100, { message: 'Max number of decimals is 100' })
				.positive()
				.nullable()
				.refine((val) => val !== null, { message: 'Required' })
				.transform((value) => value ?? null)
		),
		description: z
			.string()
			.regex(/^[\x00-\x7F]+$/, { message: 'Only Latin letters are allowed' })
			.min(2, { message: 'Description must be at least 2 characters long' })
			.max(500, {
				message: 'Description must be no more than 500 characters long',
			}),
		image: z
			.any()
			.refine((file) => file?.size > 0, 'Required image')
			.refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
			.refine(
				(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
				'Only .jpg, .jpeg, .png and .webp .gif formats are supported.'
			)
			.transform((value) => value ?? null),
		external_links: z.object({
			website: optionalHttpsUrl,
			telegram: optionalHttpsUrl,
			twitter: optionalHttpsUrl,
			discord: optionalHttpsUrl,
			tokenomics: optionalHttpsUrl,
		}),
		initial_supply: z.nullable(
			z
				.number()
				.min(2, {
					message: 'Initial Supply must be at least 2 characters long',
				})
				.max(3000000000000, {
					message: 'Initial Supply must be no more than 3000000000000',
				})
				.positive()
				.nullable()
				.refine((val) => val !== null, { message: 'Required' })
				.transform((value) => value ?? null)
		),

		max_supply: z.nullable(
			z
				.number()
				.min(2, { message: 'Max Supply must be at least 2 characters long' })
				.max(3000000000000, {
					message: 'Max Supply must be no more than 3000000000000',
				})
				.positive()
				.nullable()
				.refine((val) => val !== null, { message: 'Required' })
				.transform((value) => value ?? null)
		),
	})
	.refine((data) => data.decimals && data.decimals > 0, {
		message: 'Decimals cannot be less than 0',
		path: ['decimals'],
	})
	.refine(
		(data) =>
			data.initial_supply &&
			data.max_supply &&
			data.initial_supply > 0 &&
			data.max_supply > 0 &&
			data.initial_supply <= data.max_supply,
		{
			message: 'Initial Supply cannot be greater than Max Supply',
			path: ['initial_supply'],
		}
	)
	.refine(
		(data) =>
			data.initial_supply &&
			data.max_supply &&
			data.initial_supply > 0 &&
			data.max_supply > 0 &&
			data.max_supply >= data.initial_supply,
		{
			message: 'Initial Supply cannot be greater than Max Supply',
			path: ['max_supply'],
		}
	)

export type ICreateTokenForm = z.infer<typeof createTokenSchema>

export const createTokenDefault: ICreateTokenForm = {
	name: '',
	symbol: '',
	decimals: null,
	image: null,
	description: '',
	external_links: {
		website: '',
		telegram: '',
		twitter: '',
		discord: '',
		tokenomics: '',
	},
	initial_supply: null,
	max_supply: null,
}
