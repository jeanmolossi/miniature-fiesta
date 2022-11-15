/* eslint-disable react/display-name */
import React, { InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";
import { randID } from "../helpers/random-component-id";
import { WithError } from "./input-error";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	id?: string;
	label: string;
	error?: string;
	className?: string;
	containerClassName?: string;
}

function Input({
	id = randID(),
	label = 'Label',
	type = 'text',
	error,
	className = '',
	containerClassName = 'col-span-6',
	...props
}: InputProps, ref) {
	const ring = Boolean(error)
		? 'border-2 border-red-600 ring-red-600'
		: 'border-2 border-transparent focus:border-indigo-500 focus:ring-indigo-500'

	return (
		<div className={`${containerClassName}`}>
			<label
				htmlFor={id}
				className="block text-sm font-medium text-gray-700"
			>
				{label}
			</label>
			<input
				id={id}
				className={`mt-1 block w-full rounded-md shadow-sm ${ring} sm:text-sm ${className}`}
				aria-invalid={Boolean(error)}
				{...props}
				ref={ref}
				type={type}
			/>

			<WithError error={error} />
		</div>
	);
}

const InputRef = React.forwardRef<
	HTMLInputElement,
	InputProps & ReturnType<UseFormRegister<any>>
>(Input)

export default InputRef
export { default as CurrencyInput } from './currency-input'
