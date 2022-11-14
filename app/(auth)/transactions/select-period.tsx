'use client';

import { addMinutes } from "@/data/helpers/add-minutes";
import Select from "@/presentation/components/select";
import { startOfDay, startOfMonth, subDays } from "date-fns";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useMemo } from "react";

function backToDate(days: number): string {
	const today = new Date();
	const backDate = startOfDay(subDays(today, days))

	return backDate.toISOString()
}

interface SelectPeriodProps {
	resource: string;
}

export default function SelectPeriod({
	resource
}: SelectPeriodProps) {
	const periods = [
		{ id: '3_days', name: '3 Dias' },
		{ id: '7_days', name: '7 Dias' },
		{ id: '15_days', name: '15 Dias' },
		{ id: '30_days', name: '30 Dias' },
		{ id: 'start_month', name: 'Começo do mês' }
	];

	const dates = useMemo(() => ({
		'3_days': backToDate(3),
		'7_days': backToDate(7),
		'15_days': backToDate(15),
		'30_days': backToDate(30),
		'start_month': startOfMonth(new Date()).toISOString(),
	}), [])

	const { replace } = useRouter()

	const select = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		if (!dates[e.target.value]){
			replace(`/${resource}`)
			return;
		}

		replace(`/${resource}?start_date=${dates[e.target.value]}`)
		return Promise.resolve()
	}, [replace, dates, resource])


	return (
		<Select
			className="block min-w-[15rem] justify-self-end"
			data={periods}
			name="period"
			onBlur={null}
			onChange={select}
		/>
	)
}
