import React from "react";
import UnauthDefaultLayout from "@/presentation/components/_unauth_layout";
import LeftSide from "./(unauth)/components/left-side";
import CreateAccountForm from "./(unauth)/components/create-account-form";
import { getMe } from "@/data/usecase/me";
import { redirect } from "next/navigation";

export default async function Page() {
	const me =  await getMe();

	if (me?.id)
		redirect('/dashboard')

	return (
		<UnauthDefaultLayout>
			<div className="mt-10 sm:mt-0">
				<div className="md:grid md:grid-cols-3 md:gap-6">
					<LeftSide
						title="Crie sua conta agora mesmo"
						description="Esses dados serão seu acesso à plataforma"
					/>

					<div className="mt-5 md:col-span-2 md:mt-0">
						<CreateAccountForm />
					</div>
				</div>
			</div>
		</UnauthDefaultLayout>
	);
}
