import Link from "next/link";
import { LogoutButton } from "app/(auth)/logout.button";
import Heading from "@/presentation/components/heading";
import { links } from "./link-tree";
import MobileSidebar from "./mobile";

export default function Sidebar() {
	return (
		<>
		<div className="hidden md:block col-span-2 p-4 bg-white">
			<Heading as="h3" className="row-span-1">Miniature Fiesta</Heading>

			<div className="flex flex-1 flex-col items-stretch gap-4">
				{links.map(({ href, label }, i: number) => (
					<Link key={i} href={href}>{label}</Link>
				))}

				<LogoutButton />
			</div>
		</div>

		<MobileSidebar />
		</>
	)
}
