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
		setTimeout(this.connectDatabase, 100, this);
	}

	private connectDatabase(self: Database = this) {
		Logger.info(`Trying to connect to database '${self.config.database}' as '${self.config.user}' at '${self.config.host}'...`);

		self.connection.getConnection((err: mysql.MysqlError, connection: mysql.PoolConnection) => {
			if (err) {
				Logger.error("The server can't connect to the database!");
				Logger.error(`CODE: ${err.code} - ERRNO: ${err.errno} - MESSAGE: ${err.sqlMessage}`);
				Logger.error("Waiting 10 seconds before trying again...");
				setTimeout(self.connectDatabase, 10000, self);
			}
			else {
				Logger.info("Connected to the database successfully.");
				self.createTables();
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
			},
            {
                name: "player_customization",
                queries: [
                    "CREATE TABLE `player_customization` (" +
                        "`player_id` int(255) NOT NULL," +
                        "`gender` smallint(6) NOT NULL," +
                        "`parents_father` smallint(6) NOT NULL," +
                        "`parents_mother` smallint(6) NOT NULL," +
                        "`parents_similarity` float NOT NULL," +
                        "`parents_skin_similarity` float NOT NULL," +
                        "`features_01` float NOT NULL," +
                        "`features_02` float NOT NULL," +
                        "`features_03` float NOT NULL," +
                        "`features_04` float NOT NULL," +
                        "`features_05` float NOT NULL," +
                        "`features_06` float NOT NULL," +
                        "`features_07` float NOT NULL," +
                        "`features_08` float NOT NULL," +
                        "`features_09` float NOT NULL," +
                        "`features_10` float NOT NULL," +
                        "`features_11` float NOT NULL," +
                        "`features_12` float NOT NULL," +
                        "`features_13` float NOT NULL," +
                        "`features_14` float NOT NULL," +
                        "`features_15` float NOT NULL," +
                        "`features_16` float NOT NULL," +
                        "`features_17` float NOT NULL," +
                        "`features_18` float NOT NULL," +
                        "`features_19` float NOT NULL," +
                        "`features_20` float NOT NULL," +
                        "`appearance_01_value` smallint(6) NOT NULL," +
                        "`appearance_01_opacity` float NOT NULL," +
                        "`appearance_02_value` smallint(6) NOT NULL," +
                        "`appearance_02_opacity` float NOT NULL," +
                        "`appearance_03_value` smallint(6) NOT NULL," +
                        "`appearance_03_opacity` float NOT NULL," +
                        "`appearance_04_value` smallint(6) NOT NULL," +
                        "`appearance_04_opacity` float NOT NULL," +
                        "`appearance_05_value` smallint(6) NOT NULL," +
                        "`appearance_05_opacity` float NOT NULL," +
                        "`appearance_06_value` smallint(6) NOT NULL," +
                        "`appearance_06_opacity` float NOT NULL," +
                        "`appearance_07_value` smallint(6) NOT NULL," +
                        "`appearance_07_opacity` float NOT NULL," +
                        "`appearance_08_value` smallint(6) NOT NULL," +
                        "`appearance_08_opacity` float NOT NULL," +
                        "`appearance_09_value` smallint(6) NOT NULL," +
                        "`appearance_09_opacity` float NOT NULL," +
                        "`appearance_10_value` smallint(6) NOT NULL," +
                        "`appearance_10_opacity` float NOT NULL," +
                        "`appearance_11_value` smallint(6) NOT NULL," +
                        "`appearance_11_opacity` float NOT NULL," +
                        "`hair_value` smallint(6) NOT NULL," +
                        "`hair_color` smallint(6) NOT NULL," +
                        "`hair_highlight_color` smallint(6) NOT NULL," +
                        "`eyebrow_color` smallint(6) NOT NULL," +
                        "`beard_color` smallint(6) NOT NULL," +
                        "`eye_color` smallint(6) NOT NULL," +
                        "`blush_color` smallint(6) NOT NULL," +
                        "`lipstick_color` smallint(6) NOT NULL," +
                        "`chest_hair_color` smallint(6) NOT NULL," +
                        "PRIMARY KEY (`player_id`)," +
                        "CONSTRAINT `FK_player_customization_player_id` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`)" +
                    ") ENGINE=InnoDB DEFAULT CHARSET=utf8"
                ]
            },
            {
                name: "player_clothes",
                queries: [
                    "CREATE TABLE `player_clothes` (" +
                        "`player_id` int(255) NOT NULL," +
                        "`component` int(11) NOT NULL," +
                        "`drawable` int(11) NOT NULL," +
                        "`texture` int(11) NOT NULL," +
                        "`is_prop` tinyint(1) NOT NULL," +
                        "KEY `player_id` (`player_id`)," +
                        "CONSTRAINT `FK_player_clothes_player_id` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`)" +
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
