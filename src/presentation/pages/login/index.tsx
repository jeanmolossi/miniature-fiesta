import Heading from "@/presentation/components/heading";

export default function LoginPage() {
	return (
		<>
		<div className="mt-10 sm:mt-0">
			<div className="md:grid md:grid-cols-3 md:gap-6">
				<div className="md:col-span-1">
					<div className="px-4 sm:px-0">
						<Heading as="h3">Crie sua conta agora mesmo</Heading>
						<p className="mt-1 text-sm text-gray-600">Esses dados serão seu acesso à plataforma</p>
					</div>
				</div>

				<div className="mt-5 md:col-span-2 md:mt-0">
					<form action="#" method="POST">
					<div className="overflow-hidden shadow sm:rounded-md">
						<div className="bg-white px-4 py-5 sm:p-6">
						<div className="grid grid-cols-6 gap-6">
							<div className="col-span-6 sm:col-span-4">
							<label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
								Nome
							</label>
							<input
								type="text"
								name="first-name"
								id="first-name"
								autoComplete="given-name"
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
							</div>

							<div className="col-span-6 sm:col-span-4">
							<label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
								E-mail
							</label>
							<input
								type="email"
								name="email-address"
								id="email-address"
								autoComplete="email"
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
							</div>

							<div className="col-span-6 sm:col-span-4">
							<label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
								Senha
							</label>
							<input
								type="password"
								name="password"
								id="password"
								autoComplete="off"
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
							</div>

							<div className="col-span-6 sm:col-span-4">
							<label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
								Confirme a senha
							</label>
							<input
								type="password"
								name="confirm-password"
								id="confirm-password"
								autoComplete="off"
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
							</div>
						</div>
						</div>
						<div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
						<button
							type="submit"
							className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Criar conta
						</button>
						</div>
					</div>
					</form>
				</div>
			</div>
		</div>
		</>
	)
}
