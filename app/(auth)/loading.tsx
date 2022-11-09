import BarsLoader from "@/presentation/components/load-bars";

export default function Loading() {
	return (
		<span role={'alertdialog'} className="flex flex-1 justify-center items-center gap-4">
			<BarsLoader />
			<span role={'dialog'}>Carregando...</span>
		</span>
	)
}
