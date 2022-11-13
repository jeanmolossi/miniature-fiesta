'use client';

import React, { ChangeEvent, ChangeEventHandler, FocusEventHandler, useCallback, useState } from "react"
import { UseFormRegister } from "react-hook-form"
import { RenderIf } from "../render-if";

type Option = { label: string; value: string; }
type CheckOption = Option & { checked: boolean }

interface ButtonGroupProps {
	label?: string;
	options: Array<Option>;
	containerClassName?: string;
	defaultValue?: string;
	error?: string;
	onChange?: ChangeEventHandler<HTMLInputElement>
	onBlur?: FocusEventHandler<HTMLInputElement>
	name?: string;
}

function ButtonGroup({
	label = '',
	options: defaultOptions,
	containerClassName = '',
	defaultValue = '',
	error = '',
	onChange,
	onBlur,
	name,
}: ButtonGroupProps, ref) {
	const [selected, setSelected] = useState(() => {
		if (defaultValue)
			return defaultOptions.find(o =>o.value == defaultValue)?.value

		return '';
	})

	const options = mapDefaultOptions(defaultOptions)
	const labelID = label.toLowerCase().replace(/[\._]/gm, '-');

	const onChangeInternal = useCallback((value: string) => {
		if (onChange || onBlur) {
			type Target = {target: Partial<ChangeEvent<HTMLInputElement>['target']>}
			const e: Target = { target: { name, value } }
			onChange?.(e as any)
			onBlur?.(e as any)
		}
	}, [onChange, onBlur, name])

	const select = useCallback((value: string) => {
		return () => {
			setSelected(value)
			onChangeInternal(value)
		}
	}, [onChangeInternal])

	const ring = Boolean(error)
		? 'ring-red-600 border-red-600'
		: 'ring-sky-600 border-sky-600'

	return (
		<div className="flex flex-auto flex-col">
			<input
				type="hidden"
				value={selected}
				aria-invalid={Boolean(error)}
				ref={ref}
			/>

			<RenderIf condition={Boolean(label)}>
				<label
					id={labelID}
					className="text-sm font-medium text-gray-700 mb-1"
				>
					{label}
				</label>
			</RenderIf>

			<div className={
				`bg-sky-600 text-white rounded-lg ring-1 border shrink` +
				`grow-0 w-fit ` +
				`${ring} ${containerClassName}`
			}>
				{options.map(({ label, value }, key) => (
					<Button
						label={label}
						key={key}
						onClick={select(value)}
						checked={selected === value}
					/>
				))}
			</div>

			<RenderIf condition={Boolean(error)}>
				<div className="text-red-600 text-sm mt-1">{error}</div>
			</RenderIf>
		</div>
	)
}

interface ButtonProps extends Omit<CheckOption, 'value'> {
	onClick?: () => void;
}

function Button({ label, checked, onClick }: ButtonProps) {
	const active = checked
		? `bg-sky-700`
		: ''

	return (
		<button
			type="button"
			className={`p-2 rounded-lg hover:bg-sky-700 transition-all ${active}`}
			onClick={onClick}
		>
			{label}
		</button>
	)
}


export default React.forwardRef<
	HTMLInputElement,
	ButtonGroupProps & ReturnType<UseFormRegister<any>>
>(ButtonGroup)

function mapDefaultOptions(options: Option[]): CheckOption[] {
	return options.map((option) => ({
		...option,
		checked: false,
	}))
}
