'use client'

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Fetcher } from "@/data/helpers/fetcher";

interface LogoutButtonProps {
	className?: string;
	label?: string;
}

export function LogoutButton({ className = '', label = 'Sair' }: LogoutButtonProps) {
	const { refresh } = useRouter()
	const logout = async () => {
		try {
			await Fetcher
				.baseURL()
				.post('/api/logout')

			refresh()
		} catch (e) { toast.error(e.message) }

	}

	return (
		<button
			className={`text-start ${className}`}
			onClick={logout}
		>
			{label}
		</button>
	)
}
