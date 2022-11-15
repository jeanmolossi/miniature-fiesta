import { getAccountWallets } from "@/data/usecase/get-account-wallets";
import { getMyCategories } from "@/data/usecase/get-my-categories";
import Card from "@/presentation/components/card";
import Heading from "@/presentation/components/heading";
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
		return (
			<Card
				title="Não há um meio de pagamento nesta conta"
				hint="Adicione um meio de pagamento para esta conta"
				goBackAction
				gotoAction={{
					label: 'Adicionar pagamento',
					href: `/wallets/${params.id}/new`,
				}}
			/>
		)

	const { categories } = await getMyCategories()

	return (
		<NewTransactionForm
			categories={categories}
			payments={payments}
		/>
	)
}

