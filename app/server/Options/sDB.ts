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

		this.connection = mysql.createPool(this.config);
		this.connectDatabase();
	}

	private connectDatabase() {
		Logger.info(`Trying to connect to database '${this.config.database}' as '${this.config.user}' at '${this.config.host}'...`);

		this.connection.getConnection((err: mysql.MysqlError, connection: mysql.PoolConnection) => {
			if (err) {
				Logger.error("The server can't connect to the database!");
				Logger.error(`CODE: ${err.code} - ERRNO: ${err.errno} - MESSAGE: ${err.sqlMessage}`);
				Logger.error("Waiting 10 seconds before trying again...");
				setTimeout(this.connectDatabase, 10000);
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
				name: "user",
				queries: [
					"CREATE TABLE `user` (" +
						"`id` int(255) NOT NULL AUTO_INCREMENT," +
						"`name` varchar(64) NOT NULL," +
						"`email` varchar(256) NOT NULL," +
						"`password` varchar(128) NOT NULL," +
						"`salt` varchar(32) NOT NULL," +
						"`admin` int(11) NOT NULL DEFAULT 0," +
						"PRIMARY KEY (`id`)" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8"
				]
			},
			{
				name: "player",
				queries: [
					"CREATE TABLE `player` (" +
						"`id` int(255) NOT NULL AUTO_INCREMENT," +
						"`user_id` int(255) NOT NULL," +
						"`firstName` varchar(64) NOT NULL," +
						"`lastName` varchar(64) NOT NULL," +
						"`x` float NOT NULL," +
						"`y` float NOT NULL," +
						"`z` float NOT NULL," +
						"`rz` float NOT NULL," +
						"`dimension` int(11) NOT NULL," +
						"PRIMARY KEY (`id`)," +
						"KEY `FK_player_user_id` (`user_id`)," +
						"CONSTRAINT `FK_player_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)" +
					") ENGINE=InnoDB DEFAULT CHARSET=utf8"
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
