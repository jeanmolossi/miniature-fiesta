/* eslint-disable react/display-name */
import React from "react";
import { UseFormRegister } from "react-hook-form";

interface InputProps  {
	id?: string;
	label: string;
	error?: string;
	type?: 'text' | 'password' | 'email'
}

const randID = () => (Math.random() * 1e5).toString(16).replace(/[\.]/, '-')

const Input = React.forwardRef<
	HTMLInputElement,
	InputProps & ReturnType<UseFormRegister<any>>
>(({
	id = randID(),
	label = 'Label',
	type = 'text',
	error,
	...props
}, ref) => {
	return (
		<div className="col-span-6">
			<label
				htmlFor={id}
				className="block text-sm font-medium text-gray-700"
			>
				{label}
			</label>
			<input
				id={id}
				className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				{...props}
				ref={ref}
				type={type}
			/>

			<WithError error={error} />
		</div>
	);
})

export default Input

function WithError({ error }) {
	if (!error)
		return null

	return (
		<div className="block text-sm font-medium text-red-500 mt-2">
			{error}
		</div>
	)
}
