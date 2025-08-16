import * as sqlite3 from 'sqlite3'
import { Shop } from '../Model/Shop.ts'

export class ShopDAO {
	private connection: sqlite3.Database

	constructor(connection: sqlite3.Database) {
		this.connection = connection
	}

	public async createTable(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.connection.run('CREATE TABLE IF NOT EXISTS shop (id INTEGER PRIMARY KEY, name TEXT, address TEXT, tel TEXT, open TEXT, close TEXT, lastOrder TEXT, url TEXT, note TEXT)', error => {
				reject(error)
			})
			resolve()
		})
	}

	public async insert(shop: Shop): Promise<void> {
		return new Promise(resolve => {
			const statement = this.connection.prepare('INSERT INTO shop VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
			statement.run([shop.id, shop.name, shop.address, shop.tel, shop.open, shop.close, shop.lastOrder, shop.url, shop.note])
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