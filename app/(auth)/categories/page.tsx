import Link from "next/link"
import { Category } from "domain/categories/category"
import { getMyCategories } from "@/data/usecase/get-my-categories"
import Card from "@/presentation/components/card"
import Heading from "@/presentation/components/heading"
import { formatDate } from "@/presentation/components/helpers/format-date-distance"
import Pagination from "@/presentation/components/pagination"
import { RenderIf } from "@/presentation/components/render-if"
import Table from "@/presentation/components/table"

interface CategoriesPageProps {
	params: object;
	searchParams?: {
		relations?: string;
	}
}

function applySearchParams(searchParams: object, params: URLSearchParams) {
	Object.entries(searchParams).forEach(([key, value]) => {
		if (!params.has(key))
			params.append(key, value)
		else
			params.set(key, value)
	})
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
	const params = new URLSearchParams()
	params.set('relations', 'parent')
	params.set('sort', 'name,asc')
	applySearchParams(searchParams, params)

	const { categories, meta } = await getMyCategories(params)

	if (meta.total === 0)
		return (
			<Card
				title="Não há categorias cadastradas"
				hint="Adicione uma categoria"
				goBackAction
				gotoAction={{
					label: 'Adicionar categoria',
					href: '/categories/new'
				}}
			/>
		)

	return (
		<div>
			<div className="grid grid-cols-12 gap-4 mb-4">
				<Heading
					as="h2"
					className="col-span-12 sm:col-span-8"
				>
					Suas categorias
				</Heading>

				<div className="col-span-12 sm:col-span-4 flex items-center justify-end">
					<Link
						href={"/categories/new"}
						className="btn__green btn_size__md block text-center w-full sm:w-fit"
					>
						Nova categoria
					</Link>
				</div>
			</div>

			<div>
				<Table
					data={categories}
					renderHead={<CategoryHead />}
					renderItem={CategoryRow}
				/>

				<Pagination
					meta={meta}
					resource="categories"
				/>
			</div>
		</div>
	)
}

function CategoryHead() {
	return (
		<tr>
			<th className="p-3">#</th>
			<th className="p-3">Categoria</th>
			<th className="p-3">Categoria pai</th>
			<th className="p-3">Adicionada</th>
		</tr>
	)
}

function CategoryRow({ id, name, parent, created_at }: Category, i: number) {
	return (
		<tr key={id} className="bg-white hover:bg-gray-100 transition-colors">
			<td className="p-3 text-center">{i+1}</td>
			<td className="p-3 text-center">{name}</td>
			<td className="p-3 text-center">
				<RenderIf condition={Boolean(parent)}>
					{parent?.name}
				</RenderIf>
			</td>
			<td className="p-3 text-right">{formatDate(created_at)}</td>
		</tr>
	)
}
