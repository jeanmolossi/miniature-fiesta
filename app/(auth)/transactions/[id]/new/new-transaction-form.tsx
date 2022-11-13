'use client';

import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup';
import Select from "@/presentation/components/select";
import { yupResolver } from "@hookform/resolvers/yup";
import { Category } from "domain/categories/category";
import { Wallet } from "domain/wallets/wallet";
import { createTransaction } from "@/data/usecase/create-transaction";
import { TransactionType } from "domain/transactions/transaction";
import { toast } from "react-toastify";
import InputRef from "@/presentation/components/input";
import ButtonGroup from "@/presentation/components/button-group";

interface NewTransactionFormProps {
	payments: Wallet[]
	categories: Category[];
}

interface NewTransactionPayload {
	reference: string;
	payment: string;
	category: string;
	type: TransactionType;
	value: number;
}

export default function NewTransactionForm({
	payments,
	categories
}: NewTransactionFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<NewTransactionPayload>({ resolver: addTransactionResolver })

	const onSubmit: SubmitHandler<NewTransactionPayload> = useCallback(async (data) => {
		try {
			const { category, payment, reference, type, value } = data;
			const trasaction = await createTransaction({
				reference,
				type,
				value,
				category_id: category,
				wallet_id: payment
			})
		} catch (e) {
			toast.error(e.message ?? e)
		}
	}, [])

	return (
		<form
			className="grid  gap-4"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="grid grid-cols-6 sm:grid-cols-12 gap-4">
				<Select
					data={payments}
					label="Carteira"
					className="col-span-6"
					name="payment"
					placeholder="Selecione uma carteira"
					{...register('payment')}
					error={errors.payment?.message as string}
				/>

				<Select
					data={categories}
					label="Categoria"
					className="col-span-6"
					name="category"
					placeholder="Selecione uma categoria"
					{...register('category')}
					error={errors.category?.message as string}
				/>

				<InputRef
					label="Referência"
					className="p-1"
					{...register('reference')}
					error={errors.reference?.message as string}
				/>

				<InputRef
					label="Valor"
					className="p-1"
					{...register('value')}
					type="text"
					error={errors.value?.message as string}
				/>

				<div className="col-span-6">
					<ButtonGroup
						options={[
							{ label: 'Pagamento', value: TransactionType.EXPENSE },
							{ label: 'Recebido', value: TransactionType.INCOME },
							{ label: 'Recebido', value: 'r2' },
						]}
						{...register('type')}
						error={errors.type?.message as string}
					/>
				</div>
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
			.required('Você deve selecionar uma categoria'),
		type: yup
			.string()
			.oneOf([TransactionType.EXPENSE, TransactionType.INCOME], 'O tipo da transação é invalido')
			.required('O tipo da transação é obrigatório')
	})
)
