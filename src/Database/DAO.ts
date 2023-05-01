import * as sqlite3 from 'sqlite3'

export class DAO {
	public connection: sqlite3.Database

	constructor(dbName: string) {
		this.connection = new sqlite3.Database(dbName)
	}
}