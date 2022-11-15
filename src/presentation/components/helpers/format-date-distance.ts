import { formatDistanceToNow, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export function formatDate(date: string): string {
	return formatDistanceToNow(
		parseISO(date),
		{
			addSuffix: true,
			locale: ptBR
		}
	)
}
