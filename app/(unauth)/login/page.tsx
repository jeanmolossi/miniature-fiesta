import LeftSide from "app/(unauth)/components/left-side";
import LoginForm from "app/(unauth)/components/login-form";

export default function LoginPage() {
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
