'use client';

import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'
import { useRouter } from "next/navigation";
import { Category } from "domain/categories/category";
import { createCategory } from "@/data/usecase/create-category";
import Button from "@/presentation/components/button";
import Input from "@/presentation/components/input";
import { RenderIf } from "@/presentation/components/render-if";
import Select from "@/presentation/components/select";

interface NewCategoryFormProps {
	categories: Category[]
}

interface NewCategoryPayload {
	name: string;
	parent?: string;
}

export default function NewCategoryForm({ categories }: NewCategoryFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<NewCategoryPayload>({ resolver: yupResolver(
		yup.object().shape({
			name: yup
				.string()
				.required('A categoria é um campo obrigatório')
		})
	) })

	const { replace } = useRouter()

	const onSubmit: SubmitHandler<NewCategoryPayload> = useCallback(async (data) => {
		const category = { name: data.name }

		if (data.parent)
			Object.assign(category, { parent_id: data.parent })

		try {
			await createCategory(category)

			toast.success('Nova categoria adicionada', {
				onClose() { replace('/categories') }
			})
		} catch (e) {
			toast.error(e.message)
		}
	}, [replace])

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-4">
			<Input
				label="Categoria"
				containerClassName="col-span-12 sm:col-span-6"
				className="p-1 block w-full"
				{...register('name')}
				error={errors.name?.message}
			/>

			<RenderIf condition={categories.length > 0}>
				<Select
					data={categories}
					label="Categoria pai"
					className="col-span-12 sm:col-span-6"
					{...register('parent')}
					error={errors.parent?.message}
				/>
			</RenderIf>

			<Button type="submit">Adicionar</Button>
		</form>
	)
}
