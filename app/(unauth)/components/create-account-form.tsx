'use client';

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify";
import Input from "@/presentation/components/input";
import { CreateAccount } from "domain/users/create-account";
import { createAccount } from "@/data/usecase/create-account";

export default function CreateAccountForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateAccount>({ resolver: createAccountResolver });

	const navigate = useRouter()

	const submit: SubmitHandler<CreateAccount> = useCallback(async (data) => {
		try {
			await createAccount(data)
			navigate.replace('/login')
		} catch (error) { toast.error(error.message) }
	}, [navigate]);

	return (
		<form onSubmit={handleSubmit(submit)}>
			<div className="overflow-hidden shadow sm:rounded-md">
				<div className="bg-white px-4 py-5 sm:p-6">
					<div className="grid grid-cols-6 gap-6">
						<Input
							label="Nome"
							{...register("name")}
							error={errors.name?.message as string}
						/>

						<Input
							label="E-mail"
							type="email"
							{...register("email")}
							error={errors.email?.message as string}
						/>

						<Input
							label="Senha"
							type="password"
							{...register("password")}
							error={errors.password?.message as string}
						/>

						<Input
							label="Confimação de senha"
							type="password"
							{...register("confirm_password")}
							error={errors.confirm_password?.message as string}
						/>
					</div>
				</div>
				<div className="bg-gray-50 px-4 py-3 sm:px-6">
					<div className="grid grid-cols-4 gap-6">
						<Link
							href={"/login"}
							className="text-sm text-left col-span-2"
						>
							Já possui uma conta ? Faça login
						</Link>

						<button
							type="submit"
							className="inline-flex justify-center col-span-2 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Criar conta
						</button>
					</div>
				</div>
			</div>
		</form>
	);
}

const createAccountResolver = yupResolver(
	yup.object({
		name: yup
			.string()
			.required('O campo nome é obrigatório'),
		email: yup
			.string()
			.email('Insira um e-mail válido')
			.required('O campo e-mail é obrigatório'),
		password: yup
			.string()
			.min(6, 'O campo de senha deve conter ao menos 6 caracteres')
			.required('O campo de senha é obrigatório'),
		confirm_password: yup
			.string()
			.required('A confirmação de senha é obrigatória')
			.oneOf([yup.ref('password'), null], 'As senhas não conferem')
	})
)
