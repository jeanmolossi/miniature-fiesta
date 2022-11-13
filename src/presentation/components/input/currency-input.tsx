'use client';

import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { randID } from "../helpers/random-component-id";
import { InputProps } from "./";
import { WithError } from "./input-error";

interface CurrencyInputProps extends InputProps {}

function CurrencyInput({
	id = randID(),
	label,
	error,
	className = '',
	type = 'number',
	containerClassName = '',
	onChange: incomingOnChange,
	...props
}: CurrencyInputProps, ref) {
	const [value, setValue] = useState(0)

	const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		incomingOnChange?.(e)
		setValue(e.target.valueAsNumber || 0)
	}, [incomingOnChange])

	const visualization = useMemo(() =>
		new Intl
			.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
			.format(value/100)
	, [value])

	const ring = Boolean(error)
		? 'border-2 border-red-600 ring-red-600'
		: 'border-2 border-transparent focus:border-indigo-500 focus:ring-indigo-500'

	return (
		<div className={`col-span-6 relative ${containerClassName}`}>
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
				ref={ref}
				type={type}
				{...props}
				onChange={onChange}
			/>

			<div className="absolute left-1 bottom-1 text-sm font-medium text-slate-500">
				{visualization}
			</div>

			<WithError error={error} />
		</div>
	);
}

export default React.forwardRef<
	HTMLInputElement,
	CurrencyInputProps & ReturnType<UseFormRegister<any>>
>(CurrencyInput)
