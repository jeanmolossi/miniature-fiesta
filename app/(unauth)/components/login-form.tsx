'use client';

import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Login } from "domain/users/login";
import { login } from "@/data/usecase/login";
import Input from "@/presentation/components/input";

export default function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Login>({ resolver: loginResolver });

	const { replace } = useRouter()

	const onSubmit: SubmitHandler<Login> = useCallback(async (data) => {
		try {
			await login(data);
			replace('/dashboard')
		}
		catch(e) { toast.error(e.message) }
	}, [replace])

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="overflow-hidden shadow sm:rounded-md">
				<div className="bg-white px-4 py-5 sm:p-6">
					<div className="grid grid-cols-6 gap-6">
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
					</div>
				</div>
				<div className="bg-gray-50 px-4 py-3 sm:px-6">
					<div className="grid grid-cols-4 gap-6">
						<Link
							href={"/"}
							className="text-sm text-left col-span-3"
						>
							Ainda não possui conta? Registre-se
						</Link>

						<button
							type="submit"
							className="inline-flex justify-center col-span-1 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							Login
						</button>
					</div>
				</div>
			</div>
		</form>
	);
}

const loginResolver = yupResolver(
	yup.object({
		email: yup
			.string()
			.email('Insira um e-mail válido')
			.required('O campo e-mail é obrigatório'),
		password: yup
			.string()
			.min(6, 'O campo de senha deve conter ao menos 6 caracteres')
			.required('O campo de senha é obrigatório'),
	})
)
