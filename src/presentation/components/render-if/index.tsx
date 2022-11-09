interface RenderIfProps {
	condition: boolean;
	children: React.ReactNode;
}

export function RenderIf({ condition, children }: RenderIfProps) {
	if (!condition)
		return null;

	return <>{children}</>
}
