'use client'
import Heading from "@/presentation/components/heading";

export default function Error({ error }) {
	console.log({ error })

	return (
		<div className="flex flex-1 align-center justify-center min-h-screen w-full">
			<Heading>{ error.message }</Heading>
		</div>
	)
}
