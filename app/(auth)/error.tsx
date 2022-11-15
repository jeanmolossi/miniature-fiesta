'use client';

import { redirect } from "next/navigation";

export default function Error({ error, reset }) {
	console.log({error})

	if (['Unauthorized', 'Missing authentication'].includes(error.message)) {
		redirect('/login')
	}

	return (
		<div>Oops</div>
	)
}
