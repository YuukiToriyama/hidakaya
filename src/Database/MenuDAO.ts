import * as sqlite3 from 'sqlite3';
import { Menu } from "../Model/Menu"

export class MenuDAO {
	private connection: sqlite3.Database;

	constructor(connection: sqlite3.Database) {
		this.connection = connection;
	}

	public async createTable(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.connection.run("CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, category TEXT, href TEXT, thumbnail TEXT)", error => {
				reject(error);
			});
			resolve();
		})
	}

	public async insert(menuList: Menu[]): Promise<void> {
		return new Promise(resolve => {
			this.connection.serialize(() => {
				menuList.forEach((menu, index) => {
					const statement = this.connection.prepare("INSERT INTO menu VALUES (?, ?, ?, ?, ?, ?)")
					statement.run([index + 1, menu.name, menu.price, menu.category, menu.href, menu.thumbnail])
				})
			});
			resolve();
		})
	}

	public close(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.connection.close(error => {
				reject(error);
			});
			resolve();
		})
	}
}