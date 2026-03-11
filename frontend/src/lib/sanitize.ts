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
	return safeUrl ?? fallback
}
