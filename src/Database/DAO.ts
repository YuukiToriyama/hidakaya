import { DB } from 'https://deno.land/x/sqlite@v3.9.1/mod.ts'

export class DAO {
	public connection: DB

	constructor(dbName: string) {
		this.connection = new DB(dbName)
	}
}