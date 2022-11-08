import { getMe } from "@/data/usecase/me";
import Heading from "@/presentation/components/heading";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout.button";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default async function Layout({ children }: AuthLayoutProps) {
	const me = await getMe()

	if (!me)
		redirect('/login')

	return (
		<div className="grid grid-cols-12 min-h-screen">
			<div className="col-span-2 p-4">
				<Heading as="h3" className="row-span-1">Miniature Fiesta</Heading>

				<div className="flex flex-1 flex-col items-stretch gap-4">
					<Link href={"/dashboard"}>Dashboard</Link>
					<Link href={"/wallets"}>Carteiras</Link>
					<Link href={"/transactions"}>Transações</Link>

					<LogoutButton />
				</div>
			</div>

			<div className="grid col-span-10 p-4 bg-gray-100 grid-rows-[6rem,auto]">
				<nav className="grid grid-cols-12">
					Nav
				</nav>

				{children}
			</div>
		</div>
	)
}
