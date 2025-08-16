import * as sqlite3 from 'sqlite3'
import { categories } from '../Model/Category.ts'
import { Menu } from '../Model/Menu.ts'

export class MenuDAO {
	private connection: sqlite3.Database

	constructor(connection: sqlite3.Database) {
		this.connection = connection
	}

	public async createTable(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.connection.run('CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, category INTEGER, href TEXT, thumbnail TEXT)', error => {
				reject(error)
			})
			resolve()
		})
	}

	public async insert(menuList: Menu[]): Promise<void> {
		return new Promise(resolve => {
			this.connection.serialize(() => {
				menuList.forEach((menu, index) => {
					const categoryId = categories.filter(category => category.name == menu.category)[0].id
					const statement = this.connection.prepare('INSERT INTO menu VALUES (?, ?, ?, ?, ?, ?)')
					statement.run([index + 1, menu.name, menu.price, categoryId, menu.href, menu.thumbnail])
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