'use client';

import React, { ChangeEvent, ChangeEventHandler, FocusEvent, FocusEventHandler, MouseEventHandler, useCallback, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { RenderIf } from "../render-if";

interface SelectProps<T extends { id: string; name: string }> {
	data: T[]
	label?: string;
	name?: string;
	placeholder?: string;
	error?: string;
	emptyDataMessage?: string;
	onClick?: (selected: { id: string, label: string }) => void
	className?: string;
	required?: boolean;
	onChange?: ChangeEventHandler<HTMLInputElement>
	onBlur?: FocusEventHandler<HTMLInputElement>
}

function Select<T extends { id: string; name: string }>({
	data,
	label = '',
	name,
	placeholder = `Selecione ${label ? label.toLowerCase() : 'uma opção'}`,
	error = '',
	emptyDataMessage = 'No data results',
	onClick,
	className = '',
	required = false,
	onChange,
	onBlur,
}: SelectProps<T>, ref) {
	const [selected, setSelected] = useState({ id: '', label: placeholder })
	const [opened, setOpened] = useState(false)

	const onChangeInternal = useCallback((value: string) => {
		if (onChange || onBlur) {
			type Target = {target: Partial<ChangeEvent<HTMLInputElement>['target']>}
			const e: Target = { target: { name, value } }
			onChange?.(e as any)
			onBlur?.(e as any)
		}
	}, [onChange, onBlur, name])

	const selectOption = useCallback((_id: string, _label: string) => {
		return () => {
			const selectedOption = { id: _id, label: _label };
			setSelected(selectedOption)
			setOpened(false)
			onClick?.(selectedOption)
			onChangeInternal(_id)
		}
	}, [onClick, onChangeInternal])

	const toggle = useCallback(() => {
		setOpened(prev => !prev)
	}, [])

	if (!data.length)
		return <>{emptyDataMessage}</>

	const stateClassName = Boolean(error)
		? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500'
		: 'focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

	return (
		<div className={className}>
			<input
				type='hidden'
				value={selected.id}
				aria-invalid={Boolean(error)}
				ref={ref}
			/>

			<RenderIf condition={Boolean(label)}>
				<label htmlFor={label} className="block text-sm font-medium text-gray-700">{label}</label>
			</RenderIf>

			<div className="relative">
				<button
					id={label}
					onClick={toggle}
					type="button"
					className={`relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm ${stateClassName} sm:text-sm`}
					aria-haspopup="listbox"
					aria-expanded="true"
					aria-labelledby="listbox-label"
				>
					<span className="flex items-center">
						<span className="ml-3 block truncate">{selected.label}</span>
					</span>

					<span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
						<svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
						</svg>
					</span>
				</button>

				<RenderIf condition={opened}>
					<ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabIndex={-1} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
						<RenderIf condition={!required}>
							<Option
								key={'zero-option'}
								label={placeholder}
								checked={!selected.id}
								onClick={selectOption('', placeholder)}
							/>
						</RenderIf>

						{data.map(({ id, name }) => (
							<Option
								key={id}
								label={name}
								checked={selected.id === id}
								onClick={selectOption(id, name)}
							/>
						))}
					</ul>
				</RenderIf>
			</div>

			<RenderIf condition={Boolean(error)}>
				<p role="alert" className="text-red-500 text-sm mt-1">{error}</p>
			</RenderIf>
		</div>
	)
}

interface OptionProps {
	onClick?: MouseEventHandler<HTMLLIElement>;
	label: string;
	checked?: boolean;
}

function Option({ onClick, label, checked = false }: OptionProps) {
	return (
		<li
			className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9"
			id="listbox-option-0"
			aria-selected={checked}
			role="option"
			onClick={onClick}
		>
			<div className="flex items-center">
				<span className="font-normal ml-3 block truncate">{label}</span>
			</div>

			<RenderIf condition={checked}>
				<span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
					<svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
					</svg>
				</span>
			</RenderIf>
		</li>
	)
}

const SelectRef = React.forwardRef<
	HTMLInputElement,
	SelectProps<any> & ReturnType<UseFormRegister<any>>
>(Select)

export default SelectRef
