'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import Select from "@/presentation/components/select";
import { yupResolver } from "@hookform/resolvers/yup";
import { Category } from "domain/categories/category";
import { Wallet } from "domain/wallets/wallet";

interface NewTransactionFormProps {
	payments: Wallet[]
	categories: Category[];
}

export default function NewTransactionForm({
	payments,
	categories
}: NewTransactionFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: addTransactionResolver })

	const onSubmit = (data) => {
		console.log(data)
	}

	return (
		<form
			className="grid grid-cols-12 gap-4"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="grid grid-cols-1 col-span-12 gap-4 sm:grid-cols-2">
				<Select
					data={payments}
					label="Carteira"
					className="col-span-1"
					name="payment"
					placeholder="Selecione uma carteira"
					{...register('payment')}
					error={errors.payment?.message as string}
				/>

				<Select
					data={categories}
					label="Categoria"
					className="col-span-1"
					name="category"
					placeholder="Selecione uma categoria"
					{...register('category')}
					error={errors.category?.message as string}
				/>
			</div>

			<button type="submit">OK</button>
		</form>
	)
}

const addTransactionResolver = yupResolver(
	yup.object({
		payment: yup
			.string()
			.required('Você deve selecionar uma carteira'),
		category: yup
			.string()
			.required('Você deve selecionar uma categoria')
	})
)
