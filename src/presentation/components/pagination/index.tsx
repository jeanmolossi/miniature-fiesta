import { Meta } from "domain/misc/meta";
import Link from "next/link";
import { RenderIf } from "../render-if";
import { parseLabel, parseMeta } from "./helpers";

interface PaginationProps {
	meta: Meta;
	resource: string;
	excludeKeys?: string[]
}

export default function Pagination({ meta, resource, excludeKeys = [] }: PaginationProps) {
	const params = parseMeta(meta, excludeKeys)

	return (
		<div className='col-span-12 flex justify-center gap-2'>
			{[...params].map(([pageID, link]) => (
				<LinkButton
					key={pageID}
					appearWhen={Boolean(link)}
					resource={resource}
					params={link}
					{...parseLabel(pageID)}
				/>
			))}
		</div>
	)
}

interface LinkButtonProps {
	appearWhen?: boolean;
	resource?: string;
	params?: string;
	label: string;
	title?: string;
}

const LinkButton = ({
	appearWhen = false,
	resource = '',
	params,
	label,
	title = ''
}: LinkButtonProps) => {
	const href = `/${resource + params}`

	return (
		<RenderIf condition={appearWhen}>
			<Link
				className='btn__indigo btn_size__sm'
				href={href}
				title={title || label}>
				{label}
			</Link>
		</RenderIf>
	)
}
