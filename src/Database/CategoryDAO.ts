import { DB } from 'https://deno.land/x/sqlite@v3.9.1/mod.ts'
import { categories } from '../Model/Category.ts'

export class CategoryDAO {
	private connection: DB

	constructor(connection: DB) {
		this.connection = connection
	}

	public createTable() {
		this.connection.execute(
			'CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY, name TEXT)',
		)
		const statement = this.connection.prepareQuery(
			'INSERT INTO category VALUES (?, ?)',
		)
		categories.forEach((category) => {
			statement.execute([category.id, category.name])
		})
		statement.finalize()
	}
}
