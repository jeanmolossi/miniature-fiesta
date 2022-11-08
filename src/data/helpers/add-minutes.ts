export function addMinutes(_in: Date, minutes: number): Date {
	const now = new Date();

	_in.setMinutes(now.getMinutes() + minutes);

	return _in;
}
