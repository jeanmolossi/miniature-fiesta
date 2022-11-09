import { getAccountWallets } from "@/data/usecase/get-account-wallets";
import { getMyCategories } from "@/data/usecase/get-my-categories";
import Heading from "@/presentation/components/heading";
import Select from "@/presentation/components/select";
import NewTransactionForm from "./new-transaction-form";

interface NewTransactionPageParams {
	params: { id?: string };
	searchParams: object
}

export default async function NewPage({ params }: NewTransactionPageParams) {
	if (!params.id)
		return <Heading>Por favor, escolha uma carteira.</Heading>

	const { payments, meta } = await getAccountWallets({ account: params.id })

	if (meta.total === 0)
		return <Heading as="h2">Nenhuma carteira nesta conta</Heading>

	const { categories } = await getMyCategories()

	return (
		<NewTransactionForm
			categories={categories}
			payments={payments}
		/>
	)
}

