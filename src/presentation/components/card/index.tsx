'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../button";
import Heading from "../heading";
import { RenderIf } from "../render-if";

interface CardProps {
	title: string;
	hint: string;
	gotoAction?: {
		label: string;
		href?: string;
	};
	goBackAction?: boolean;
	className?: string;
}


export default function Card({
	title,
	hint,
	gotoAction,
	goBackAction = false,
	className = ''
}: CardProps) {
	const router = useRouter()
	return (
		<div className="flex flex-col justify-evenly items-center min-h-screen flex-1" role={'alertdialog'}>
			<div
				className={
					`border border-dashed border-indigo-400 p-6 rounded-2xl` +
					` shadow-xl bg-white flex flex-col gap-4 max-w-lg m-4 sm:m-0`
				}
			>
				<div>
					<Heading as="h2" className="text-indigo-900">{title}</Heading>
				</div>

				<div>
					<span role={'alert'} className="font-medium text-slate-500">{hint}</span>
				</div>

				<div className="grid grid-cols-12 sm:grid-cols-6 gap-4">
					<RenderIf condition={goBackAction}>
						<Button
							fullWidth
							className={`col-span-12 sm:col-span-${Boolean(gotoAction) ? '3' : '6'}`}
							onClick={() => router.back()}
							variant={Boolean(gotoAction) ? 'rose' : 'indigo'}
						>
							Voltar
						</Button>
					</RenderIf>

					<RenderIf condition={Boolean(gotoAction)}>
						<Link
							className="btn__indigo btn_size__md col-span-12 sm:col-span-3"
							href={gotoAction?.href}
						>
							{gotoAction?.label || 'No label'}
						</Link>
					</RenderIf>
				</div>
			</div>

			{/* SEPARATOR */}
			<div></div>
		</div>
	)
}
