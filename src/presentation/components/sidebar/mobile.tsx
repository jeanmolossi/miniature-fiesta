'use client';

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { links } from "./link-tree";


export default function MobileSidebar() {
	const [open, setOpen] = useState(false)

	const className = open
		? 'translate-x-0'
		: 'translate-x-full'

	const onClose = useCallback(() => {
		setOpen(false)
	}, [])

	const pathname = usePathname()

	useEffect(() => {
		if (open) onClose()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname])

	return (
		<div className={
			`${className} ` +
			`flex md:hidden fixed inset-0 bg-white z-50 flex-col p-4 gap-4 ` +
			`transition-all`
		}>
			<button
				onClick={() => setOpen(true)}
				className={`absolute bottom-2 right-full mr-2 bg-white p-2 shadow-md rounded-lg`}
			>
				<div className="flex flex-col w-4 gap-1">
						<div className="col-span-12 bg-black rounded-lg h-1"></div>
						<div className="col-span-12 bg-black rounded-lg h-1"></div>
						<div className="col-span-12 bg-black rounded-lg h-1"></div>
					</div>
			</button>

			<button
				onClick={onClose}
				className="btn__rose btn_size__md self-end block w-min"
			>
				<span>X</span>
			</button>

			{links.map(({ href, label }, i: number) => (
				<Link
					key={i}
					href={href}
					className="btn__indigo btn_size__md"
				>
					{label}
				</Link>
			))}
		</div>
	)
}
