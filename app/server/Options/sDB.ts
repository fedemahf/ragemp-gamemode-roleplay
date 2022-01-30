import * as mysql from 'mysql';
import Logger from './sLogger';

class Database {
	connection: any;

	constructor() {
		this.connection =  mysql.createPool({
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE
		});

		this.checkConnection();
	}

	checkConnection() {
		this.connection.getConnection((err: any) => {
			if (err) {
				Logger.error(`MYSQL SERVER NOT WORKING!`);
				Logger.error(`err.code: ${err.code}`);
				Logger.error(`err.errno: ${err.errno}`);
				Logger.error(`err.fatal: ${err.fatal}`);
				Logger.error(`err.sql: ${err.sql}`);
				Logger.error(`err.sqlState: ${err.sqlState}`);
				Logger.error(`err.sqlMessage: ${err.sqlMessage}`);
				throw err;
			}
			else {
				Logger.info(`MYSQL SERVER READY!`);
			}
		});
	}

	try(query: string) {
		return new Promise((r, j) => this.connection.query(query, null , (err: any, data: any) => {
			if (err) {
				Logger.error(query);
				return j(err);
			}
			r(data);
		}))
	}

	async query(query: string) {
		const start = new Date().getTime(); 
		const data = await this.try(query);
		const time = new Date().getTime() - start;
		if (time >= 500) Logger.warn(`'${query}' ends with: ${time / 1000}s`);
		else Logger.silly(`'${query}' ends with: ${time / 1000}s`);
		return data;
	}

}
const a = new Database();
export default a;
