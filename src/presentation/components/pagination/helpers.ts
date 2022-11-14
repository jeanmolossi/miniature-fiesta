import { Meta } from "domain/misc/meta"

type PageID = 'first_page' | 'prev_page' | 'next_page' | 'last_page';

function getPaginationLinks(meta: Meta) {
	const params = new Map<PageID, string>([])

	Object.entries(meta).forEach(([key, value]) => {
		if (key.match(/_page$/) && !key.match(/^per_/)) {
			params.set(key as PageID, value)
		}
	})

	return params
}

export function parseMeta(meta: Meta, excludeKeys: string[] = []) {
	const pageLinks = getPaginationLinks(meta)
	const finalMeta = new Map<PageID, string>([])

	for(let [pageID, url] of pageLinks) {
		const params = parseUrl(url)
		excludeKeys.forEach(key => {
			if (params.has(key)) params.delete(key)
		})

		finalMeta.set(pageID, `?${params.toString().toLowerCase()}`)
	}

	return finalMeta
}

export function parseUrl(url: string = '') {
	const [_, params] = url.split('?')
	const search = new URLSearchParams(params)
	return search
}

type PickLabel = {
	label: string;
	title: 'Primeira página' | 'Página anterior' | 'Próxima página' | 'Última página';
}

export function parseLabel(pageID: PageID): PickLabel {
	const obj: { [k: string]: PickLabel } = {
		'first_page': { label: 'Primeira página', title: 'Primeira página' },
		'prev_page': { label: "<", title: 'Página anterior' },
		'next_page': { label: ">", title: 'Próxima página' },
		'last_page': { label: 'Última página', title: 'Última página' },
	}

	return obj[pageID]
}
