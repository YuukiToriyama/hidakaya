import { DB } from 'https://deno.land/x/sqlite@v3.9.1/mod.ts'
import { categories } from '../Model/Category.ts'

export class CategoryDAO {
	private connection: DB

	constructor(connection: DB) {
		this.connection = connection
	}

	public async createTable(): Promise<void> {
		this.connection.execute(
			'CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY, name TEXT)',
		)
		categories.forEach((category) => {
			const statement = this.connection.prepareQuery(
				'INSERT INTO category VALUES (?, ?)',
			)
			statement.execute([category.id, category.name])
			statement.finalize()
		})
	}
}
