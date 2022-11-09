/* eslint-disable react/display-name */
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { randID } from "../helpers/random-component-id";

interface InputProps  {
	id?: string;
	label: string;
	error?: string;
	type?: 'text' | 'password' | 'email'
}

function Input({
	id = randID(),
	label = 'Label',
	type = 'text',
	error,
	...props
}: InputProps, ref) {
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
}

function WithError({ error }) {
	if (!error)
		return null

	return (
		<div className="block text-sm font-medium text-red-500 mt-2">
			{error}
		</div>
	)
}

const InputRef = React.forwardRef<
	HTMLInputElement,
	InputProps & ReturnType<UseFormRegister<any>>
>(Input)

export default InputRef
