import { getMyCategories } from "@/data/usecase/get-my-categories"
import NewCategoryForm from "./new-category-form"

export default async function NewCategoryPage() {
	const params = new URLSearchParams()
	params.set('relations', 'parent')

	const { categories } = await getMyCategories(params)
	const childableCategories = categories.filter(c => !Boolean(c.parent))

	return (
		<NewCategoryForm
			categories={childableCategories}
		/>
	)
}
