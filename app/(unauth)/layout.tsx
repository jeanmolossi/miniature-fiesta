import { redirect } from "next/navigation";
import { getMe } from "@/data/usecase/me";
import UnauthDefaultLayout from "@/presentation/components/_unauth_layout";

export default async function Layout({children}) {
	const me =  await getMe();

	if (me?.id)
		redirect('/dashboard')

	return (
		<UnauthDefaultLayout>{children}</UnauthDefaultLayout>
	)
}
