import * as mysql from 'mysql';
import Logger from './sLogger';

class Database {
	private connection: mysql.Pool;
	private config: mysql.ConnectionConfig;

	constructor() {
		this.config = {
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE
		};

		Logger.info(`Trying to connect to database '${this.config.database}' as '${this.config.user}' at '${this.config.host}'...`);

		this.connection = mysql.createPool(this.config);
		this.connection.getConnection((err: mysql.MysqlError, connection: mysql.PoolConnection) => {
			if (err) {
				Logger.error(`The server can't connect to the database!`);
				Logger.error(`err.code: ${err.code}`);
				Logger.error(`err.errno: ${err.errno}`);
				Logger.error(`err.fatal: ${err.fatal}`);
				Logger.error(`err.sql: ${err.sql}`);
				Logger.error(`err.sqlState: ${err.sqlState}`);
				Logger.error(`err.sqlMessage: ${err.sqlMessage}`);
				throw err;
			}
			else {
				Logger.info(`Connected to the database successfully.`);
				this.createTables();
			}
		});
	}

	private try(query: string) {
		return new Promise((r, j) => this.connection.query(query, null , (err: any, data: any) => {
			if (err) {
				Logger.error(query);
				return j(err);
			}
			r(data);
		}))
	}

	public escape(value: any, stringifyObjects?: boolean, timeZone?: string): string {
		return mysql.escape(value, stringifyObjects, timeZone);
	}

	public async query(query: string) {
		const start = new Date().getTime();
		const data = await this.try(query);
		const time = new Date().getTime() - start;
		if (time >= 500) Logger.warn(`'${query}' ends with: ${time / 1000}s`);
		else Logger.silly(`'${query}' ends with: ${time / 1000}s`);
		return data;
	}

	private async createTables(): Promise<void> {
		let tables = [
			{
				name: `users`,
				queries: [
					"CREATE TABLE `users` (" +
						"`guid` int(255) NOT NULL," +
						"`email` varchar(255) NOT NULL," +
						"`firstName` varchar(255) NOT NULL," +
						"`lastName` varchar(255) NOT NULL," +
						"`socialClub` varchar(255) NOT NULL," +
						"`lang` varchar(3) NOT NULL DEFAULT 'eng'," +
						"`adminlvl` int(10) NOT NULL DEFAULT '0'," +
						"`position` text NOT NULL," +
						"`password` text NOT NULL," +
						"`salt` text NOT NULL" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8;",
					"ALTER TABLE `users` ADD PRIMARY KEY (`guid`);",
					"ALTER TABLE `users` MODIFY `guid` int(255) NOT NULL AUTO_INCREMENT;"
				]
			}
		];

		for (let table of tables) {
			let result = await this.query(`SHOW tables FROM \`${this.config.database}\` LIKE '${table.name}';`);

			if (!result[0]) {
				Logger.warn(`'${table.name}' table not found! Trying to create...`);

				for (let query of table.queries) {
					Logger.warn(query);
					await this.query(query);
				}
			}
		}
	}
}
const a = new Database();
export default a;
