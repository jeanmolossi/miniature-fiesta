import React, { ButtonHTMLAttributes } from "react"

type Variant = 'indigo' | 'rose' | 'amber' | 'cyan' | 'green';
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	variant?: Variant;
	size?: Size;
	fullWidth?: boolean;
	className?: string;
}

export default function Button({
	children,
	variant = 'indigo',
	size = 'md',
	fullWidth = false,
	className: incomingClassName = '',
	...buttonProps
}: ButtonProps) {
	const className = [
		`btn__${variant}`,
		`btn_size__${size}`,
		`${fullWidth ? 'w-full' : 'w-min'}`,
		`transition-all`,
		incomingClassName
	].join(' ')

	return (
		<button className={className} {...buttonProps}>
			{children}
		</button>
	)
}

