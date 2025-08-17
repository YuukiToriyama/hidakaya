import { DB } from 'https://deno.land/x/sqlite@v3.9.1/mod.ts'
import { categories } from '../Model/Category.ts'
import { Menu } from '../Model/Menu.ts'

export class MenuDAO {
	private connection: DB

	constructor(connection: DB) {
		this.connection = connection
	}

	public createTable() {
		this.connection.execute(
			`CREATE TABLE IF NOT EXISTS menu (
				id INTEGER PRIMARY KEY, 
				name TEXT, 
				price INTEGER, 
				category INTEGER, 
				href TEXT, 
				thumbnail TEXT
			 )`,
		)
	}

	public insert(menuList: Menu[]) {
		const statement = this.connection.prepareQuery(
			'INSERT INTO menu VALUES (?, ?, ?, ?, ?, ?)',
		)
		menuList.forEach((menu, index) => {
			const categoryId = categories.filter((category) =>
				category.name == menu.category
			)[0].id
			statement.execute([
				index + 1,
				menu.name,
				menu.price,
				categoryId,
				menu.href,
				menu.thumbnail,
			])
		})
		statement.finalize()
	}
}
