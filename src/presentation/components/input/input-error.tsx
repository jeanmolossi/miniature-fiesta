export function WithError({ error }) {
	if (!error)
		return null

	return (
		<div className="block text-sm font-medium text-red-500 mt-2">
			{error}
		</div>
	)
}
