import { PingHistory } from './models/pinghistory/PingHistoryModel';
import { ApiService } from './models/apiservice/ApiServiceModel';
import Config from '../utils/Config';
import * as mongoose from "mongoose";
import Logger from "../utils/Logger";

export default class Database {

	private static _instance: Database;

	constructor() {
		(<any>mongoose).Promise = global.Promise;
	}

	public static get instance(): Database {
		if (Database._instance == null) {
			Database._instance = new Database();
		}
		return Database._instance;
	}

	public connect(): Promise<void> {
		// this.clear();
		// User.remove({}).exec();
		// User.find({}).exec().then((users) => {
		// 	console.log(users);
		// });
		return new Promise<void>((resolve, reject) => {
			mongoose.connect(Config.DB_PATH, { useNewUrlParser: true })
				.then(() => {
					Logger.success("Database connection OK");
					this.initialize();
					resolve();
				}).catch((err) => {
					Logger.error("DB connection failed : " + err)
					reject(err);
				});
		});
	}

	public clear(): Promise<void> {
		// let names:string[] = mongoose.modelNames();
		let proms:Promise<any>[] = [];
		proms.push(ApiService.remove({}).exec());
		proms.push(PingHistory.remove({}).exec());
		return Promise.all(proms).then( _=> {
			Logger.info("Clear complete");
		})
	}

	private initialize():void {
		//Instanciate models by simply referencing them
		ApiService;
		PingHistory;
	}
}