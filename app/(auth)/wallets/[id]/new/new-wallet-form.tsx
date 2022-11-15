'use client';

import * as yup from 'yup';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { WalletBrand, WalletType } from "domain/wallets/wallet";
import { useCallback } from 'react';
import Heading from '@/presentation/components/heading';
import Input, { CurrencyInput } from '@/presentation/components/input';
import Button from '@/presentation/components/button';
import Select from '@/presentation/components/select';
import { RenderIf } from '@/presentation/components/render-if';
import { Fetcher } from '@/data/helpers/fetcher';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface NewWalletFormProps {
	account: string;
}

interface NewWalletPayload {
	name: string;
	account: string;
	type: WalletType;
	limit?: string;
	brand?: WalletBrand;
}

const brands: Array<{ id: WalletBrand, name: string }> = [
	{ id: WalletBrand.ELO, name: 'Elo' },
	{ id: WalletBrand.AMERICAN_EXPRESS, name: 'American Express' },
	{ id: WalletBrand.MASTER, name: 'Master card' },
	{ id: WalletBrand.VISA, name: 'Visa' },
]

const types: Array<{ id: WalletType, name: string }> = [
	{ id: WalletType.CASH, name: 'Dinheiro' },
	{ id: WalletType.CREDIT, name: 'Cartão de Crédito' },
	{ id: WalletType.DEBIT, name: 'Cartão de Débito' },
]

export default function NewWalletForm({
	account
}: NewWalletFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch
	} = useForm<NewWalletPayload>({ resolver: addWalletResolver })

	const { replace } = useRouter()

	const onSubmit: SubmitHandler<NewWalletPayload> = useCallback(async (data) => {
		const { name, account: account_id, type, limit, brand }  = parseData({ ...data, account })

		try {
			const result = await Fetcher
				.baseURL()
				.setBody({ name, account_id, type, limit, brand })
				.post('/api/create-wallet')

			if (result.isError || result.statusCode >= 400){
				toast.error(result.data)
				return;
			}

			toast.success(`Meio de pagamento criado!`, {
				onClose() { replace('/dashboard') }
			})
		} catch(e) {
			toast.error(e.message)
		}
	}, [account, replace]);

	const selectedType = watch('type')

	return (
		<form
			className='grid gap-4'
			onSubmit={handleSubmit(onSubmit)}
		>
			<Heading as="h3">Adicionar nova carteira</Heading>

			<div className='grid grid-cols-6 sm:grid-cols-12 gap-4'>
				<Input
					label="Identificação"
					className='p-1'
					{...register('name')}
					error={errors.name?.message}
				/>

				<Select
					data={types}
					label="Tipo"
					className='col-span-6'
					{...register('type')}
					error={errors.type?.message}
				/>

				<RenderIf condition={selectedType && selectedType !== WalletType.CASH}>
					<Select
						data={brands}
						label="Bandeira"
						className='col-span-6'
						{...register('brand')}
						error={errors.brand?.message}
					/>
				</RenderIf>

				<RenderIf condition={selectedType === WalletType.CREDIT}>
					<CurrencyInput
						label='Limite do cartão'
						className={` p-1 text-right`}
						{...register('limit')}
						error={errors.limit?.message}
					/>
				</RenderIf>
			</div>

			<Button type="submit">
				Adicionar
			</Button>
		</form>
	)
}

const addWalletResolver = yupResolver(
	yup.object().shape({
		name: yup
			.string()
			.required('O campo de identificação é obrigatório'),
		type: yup
			.string()
			.oneOf([
				WalletType.CASH,
				WalletType.CREDIT,
				WalletType.DEBIT,
			], 'Você deve selecionar um tipo de carteira')
			.required('Você deve selecionar um tipo de carteira'),
		brand: yup
			.string()
			.when('type', {
				is: WalletType.CREDIT || WalletType.DEBIT,
				then: (schema) => schema.oneOf([
					WalletBrand.ELO,
					WalletBrand.AMERICAN_EXPRESS,
					WalletBrand.MASTER,
					WalletBrand.VISA,
				], `Você deve selecionar uma brandeira`),
				otherwise: (schema) => {
					schema.cast(undefined);
					return schema.optional();
				}
			}),
		limit: yup
			.string()
			.when('type', {
				is: WalletType.CREDIT,
				then: (schema) => schema.required('Para cartão de crédito, informe o limite'),
				otherwise: (schema) => {
					schema.cast(undefined);
					return schema.optional()
				}
			}),
	})
)

function parseData(data: NewWalletPayload): NewWalletPayload {
	if (data.type === WalletType.CASH) {
		return {
			account: data.account,
			type: data.type,
			name: data.name,
		}
	}

	if (data.type === WalletType.DEBIT) {
		return {
			account: data.account,
			type: data.type,
			name: data.name,
			brand: data.brand
		}
	}

	return data
}
