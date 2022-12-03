import Link from "next/link";
import { redirect } from 'next/navigation'
import { getMe } from "@/data/usecase/me";
import UnauthDefaultLayout from "@/presentation/components/_unauth_layout";

export const revalidate = 0,
	fetchCache = "only-no-store"

export default async function Layout({ children }) {
	const me = await getMe()

	if (typeof me === 'undefined')
		return <UnauthDefaultLayout>{children}</UnauthDefaultLayout>

	redirect('/dashboard')

	return (
		<UnauthDefaultLayout>
			<Link
				className="btn__indigo btn_size__md"
				href={"/dashboard"}
			>
				Go to dashboard
			</Link>
		</UnauthDefaultLayout>
	)
}

