import Heading from "@/presentation/components/heading";

interface LeftSideProps {
	title: string;
	description: string;
}

export default function LeftSide({ title, description }: LeftSideProps) {
	return (
		<div className="flex items-center md:col-span-1">
			<div className="px-4 sm:px-0">
				<Heading as="h3">
					{title}
				</Heading>
				<p className="mt-1 text-sm text-gray-600">
					{description}
				</p>
			</div>
		</div>
	)
}
