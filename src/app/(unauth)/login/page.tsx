'use client';

import { use } from "react";
import { redirect } from "next/navigation";
import LeftSide from "src/app/(unauth)/components/left-side";
import LoginForm from "src/app/(unauth)/components/login-form";
import { refreshToken } from "@/data/usecase/refresh-token";

const fetchMap = new Map<string, Promise<any>>([]);
function queryClient(name: string, query: () => Promise<any>) {
	if (!fetchMap.has(name))
		fetchMap.set(name, query())
	return fetchMap.get(name)
}

export const revalidate = 0

export default function LoginPage() {
	const authorized = use(queryClient('authorization', refreshToken))
	if (authorized)
		redirect('/dashboard')

	return (
		<div className="mt-10 sm:mt-0">
			<div className="md:grid md:grid-cols-3 md:gap-6">
				<LeftSide
					title="Faça login agora mesmo"
					description="E tenha acesso à plataforma"
				/>

				<div className="mt-5 md:col-span-2 md:mt-0">
					<LoginForm />
				</div>
			</div>
		</div>
	)
}
