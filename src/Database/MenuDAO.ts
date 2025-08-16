import { DB } from 'https://deno.land/x/sqlite@v3.9.1/mod.ts'
import { categories } from '../Model/Category.ts'
import { Menu } from '../Model/Menu.ts'

export class MenuDAO {
	private connection: DB

	constructor(connection: DB) {
		this.connection = connection
	}

	public async createTable(): Promise<void> {
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

	public async insert(menuList: Menu[]): Promise<void> {
		menuList.forEach((menu, index) => {
			const categoryId = categories.filter((category) =>
				category.name == menu.category
			)[0].id
			const statement = this.connection.prepareQuery(
				'INSERT INTO menu VALUES (?, ?, ?, ?, ?, ?)',
			)
			statement.execute([
				index + 1,
				menu.name,
				menu.price,
				categoryId,
				menu.href,
				menu.thumbnail,
			])
			statement.finalize()
		})
	}
}
