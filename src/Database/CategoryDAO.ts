import * as sqlite3 from 'sqlite3'
import { categories } from '../Model/Category'

export class CategoryDAO {
	private connection: sqlite3.Database

	constructor(connection: sqlite3.Database) {
		this.connection = connection
	}

	public async createTable(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.connection.run('CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY, name TEXT)', error => {
				reject(error)
			})
			this.connection.serialize(() => {
				categories.forEach(({ id, name }) => {
					const statement = this.connection.prepare('INSERT INTO category VALUES (?, ?)')
					statement.run([id, name])
				})
			})
			resolve()
		})
	}

	public close(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.connection.close(error => {
				reject(error)
			})
			resolve()
		})
	}
}