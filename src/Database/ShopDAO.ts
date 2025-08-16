import { DB } from 'https://deno.land/x/sqlite@v3.9.1/mod.ts'
import { Shop } from '../Model/Shop.ts'

export class ShopDAO {
	private connection: DB

	constructor(connection: DB) {
		this.connection = connection
	}

	public async createTable(): Promise<void> {
		this.connection.execute(
			`CREATE TABLE IF NOT EXISTS shop (
				id INTEGER PRIMARY KEY, 
				name TEXT, 
				address TEXT, 
				tel TEXT, 
				open TEXT, 
				close TEXT, 
				lastOrder TEXT, 
				url TEXT, 
				note TEXT
			 )`,
		)
	}

	public async insert(shop: Shop): Promise<void> {
		const statement = this.connection.prepareQuery(
			'INSERT INTO shop VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
		)
		statement.execute([
			shop.id,
			shop.name,
			shop.address,
			shop.tel,
			shop.open,
			shop.close,
			shop.lastOrder,
			shop.url,
			shop.note,
		])
		statement.finalize()
	}
}
