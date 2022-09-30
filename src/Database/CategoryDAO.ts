import * as sqlite3 from 'sqlite3';

export class CategoryDAO {
	private connection: sqlite3.Database;

	constructor(connection: sqlite3.Database) {
		this.connection = connection;
	}

	public async createTable(): Promise<void> {
		const categories = [
			{ id: 1, name: "ラーメン" },
			{ id: 2, name: "セット" },
			{ id: 3, name: "定食" },
			{ id: 4, name: "単品" },
			{ id: 5, name: "おつまみ" },
			{ id: 6, name: "ドリンク" },
			{ id: 7, name: "テイクアウト" },
			{ id: 8, name: "トッピング" }
		];

		return new Promise((resolve, reject) => {
			this.connection.run("CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY, name TEXT)", error => {
				reject(error);
			});
			this.connection.serialize(() => {
				categories.forEach(({ id, name }) => {
					const statement = this.connection.prepare("INSERT INTO category VALUES (?, ?)");
					statement.run([id, name]);
				});
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