export function getSafeHttpsUrl(value?: string | null) {
	if (!value) return null

	try {
		const url = new URL(value)

		if (url.protocol !== 'https:') {
			return null
		}

		return url.toString()
	} catch {
		return null
	}
}

export function getSafeImageSrc(
	value?: string | null,
	fallback: string = '/images/no-token.png'
) {
	if (!value) return fallback

	const safeUrl = getSafeHttpsUrl(value)
	if (!safeUrl) return fallback

	const url = new URL(safeUrl)
	if (url.hostname === 'sapphire-advisory-bird-981.mypinata.cloud') {
		url.hostname = 'gateway.pinata.cloud'
	}
	return url.toString()
}
