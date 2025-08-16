export interface Category {
	/** ID */
	id: number
	/** カテゴリ名 */
	name: string
}

export const categories: Category[] = [
	{ id: 1, name: 'ラーメン' },
	{ id: 2, name: 'セット' },
	{ id: 3, name: '定食' },
	{ id: 4, name: '単品' },
	{ id: 5, name: 'おつまみ' },
	{ id: 6, name: 'ドリンク' },
	{ id: 7, name: 'おすすめ' },
	{ id: 8, name: 'トッピング' },
]
