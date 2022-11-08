'use client'

import { Fetcher } from "@/data/helpers/fetcher";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
