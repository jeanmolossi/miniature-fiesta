'use client'

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { makeHttpClient } from "@/data/client/factory/http-client";

interface LogoutButtonProps {
	className?: string;
	label?: string;
}

export function LogoutButton({ className = '', label = 'Sair' }: LogoutButtonProps) {
	const { replace } = useRouter()
	const logout = async () => {
		try {
			await makeHttpClient().post('/api/logout')
			replace('/login')
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
