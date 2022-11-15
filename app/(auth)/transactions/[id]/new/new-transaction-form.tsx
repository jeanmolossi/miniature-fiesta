'use client';

import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useRouter } from "next/navigation";
import { Category } from "domain/categories/category";
import { TransactionType } from "domain/transactions/transaction";
import { Wallet } from "domain/wallets/wallet";
import { createTransaction } from "@/data/usecase/create-transaction";
import Button from "@/presentation/components/button";
import ButtonGroup from "@/presentation/components/button-group";
import Heading from "@/presentation/components/heading";
import Input, { CurrencyInput } from "@/presentation/components/input";
import Select from "@/presentation/components/select";


interface NewTransactionFormProps {
	payments: Wallet[]
	categories: Category[];
}

interface NewTransactionPayload {
	reference: string;
	payment: string;
	category: string;
	type: TransactionType;
	value: string;
}

export default function NewTransactionForm({
	payments,
	categories
}: NewTransactionFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<NewTransactionPayload>({ resolver: addTransactionResolver })

	const { replace } = useRouter()

	const onSubmit: SubmitHandler<NewTransactionPayload> = useCallback(async (data) => {
		try {
			const { category, payment, reference, type, value } = data;
			await createTransaction({
				reference,
				type,
				value: +value
					.replace(/\D/gmi, '')
					.replace(',', '.'),
				category_id: category,
				wallet_id: payment
			})

			reset()
			replace('/dashboard')
		} catch (e) {
			toast.error(e.message ?? e)
		}
	}, [reset, replace])

	return (
		<form
			className="grid  gap-4"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Heading as="h3">Adicionar nova transação</Heading>

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

				<Input
					label="Referência"
					className="p-1"
					{...register('reference')}
					error={errors.reference?.message as string}
				/>

				<CurrencyInput
					label="Valor"
					className="p-1 text-right"
					{...register('value')}
					type="number"
					error={errors.value?.message as string}
				/>

				<div className="col-span-6">
					<ButtonGroup
						label="Tipo da transação"
						options={[
							{ label: 'Pagamento', value: TransactionType.EXPENSE },
							{ label: 'Recebido', value: TransactionType.INCOME },
						]}
						defaultValue={TransactionType.EXPENSE}
						{...register('type')}
						error={errors.type?.message as string}
					/>
				</div>
			</div>

			<Button type="submit">
				Adicionar
			</Button>
		</form>
	)
}

const addTransactionResolver = yupResolver(
	yup.object({
		reference: yup
			.string()
			.required('Dê uma anotação de referência para a transação'),
		value: yup
			.string()
			.required('O valor da transação é obrigatório'),
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
