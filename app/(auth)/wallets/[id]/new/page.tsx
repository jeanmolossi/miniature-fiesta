import Heading from "@/presentation/components/heading";
import NewWalletForm from "./new-wallet-form";

interface NewWalletPageParams {
	params: { id?: string };
	searchParams: object;
}

export default async function NewWalletPage({ params }: NewWalletPageParams) {
	if (!params.id)
		return <Heading>Por favor escolha uma conta</Heading>

	return (
		<NewWalletForm account={params.id} />
	)
}
