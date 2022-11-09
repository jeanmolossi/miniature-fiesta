export function randID(prefix = '', salt = 1e5) {
	const id = (Math.random() * salt).toString(16).replace(/[\.]/, '-')

	if (prefix)
		return `${prefix}-${id}`

	return id
}
