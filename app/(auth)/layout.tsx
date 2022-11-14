import { getMe } from "@/data/usecase/me";
import Sidebar from "@/presentation/components/sidebar";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default async function Layout({ children }: AuthLayoutProps) {
	const me = await getMe()

	if (!me)
		redirect('/login')

	return (
		<div className="grid grid-cols-12 min-h-screen bg-gray-100">
			<Sidebar />

			<div className="grid col-span-12 md:col-span-10 p-4">
				{children}
			</div>
		</div>
	)
}
