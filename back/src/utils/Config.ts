import Logger, {LogStyle } from "../utils/Logger";
import * as fs from "fs";


/**
 * Created by FDursus
 */
export default class Config {

	private static _ENV_NAME: EnvName;
	private static _CONF_PATH: string = "env.conf";

	public static get LOGS_ENABLED(): boolean {
		return this.getEnvData({
			dev: true,
			prod: false,
		});
	}

	public static get DB_PATH(): string {
		return this.getEnvData({
			dev: 'mongodb://localhost/services_status_manager',
			prod: 'mongodb://localhost/services_status_manager',
		});
	}

	public static get SERVER_PORT(): number {
		return this.getEnvData({
			dev: 3023,
			prod: 80,
		});
	}

	public static get PUBLIC_PATH(): string {
		return this.getEnvData({
			dev: "../front/build/",
			prod: "../front/",
		});
	}
	
	public static get UPLOAD_DIR(): string {
		return this.PUBLIC_PATH + "upload/";
	}

	public static get SERVER_NAME(): string {
		return this.getEnvData({
			dev: "",
			prod: "",
		});
	}

	public static get CONTROLLERS_PATH(): string {
		return this.getEnvData({
			dev: "build/controllers",
			prod: "controllers",
		});
	}





	/**
	 * Extract a data from an hashmap depending on the current environment.
	 * @param map
	 * @returns {any}
	 */
	private static getEnvData(map: any): any {
		//Grab env name the first time
		if (!this._ENV_NAME) {
			if (fs.existsSync(this._CONF_PATH)) {
				let content: string = fs.readFileSync(this._CONF_PATH, "utf8");
				this._ENV_NAME = <EnvName>content;
				let str: String = "  :: Current environment \"" + content + "\" ::  ";
				let head: string = str.replace(/./g, " ");
				console.log("\n");
				console.log(LogStyle.BgGreen + head + LogStyle.Reset);
				console.log(LogStyle.Bright + LogStyle.BgGreen + LogStyle.FgWhite + str + LogStyle.Reset);
				console.log(LogStyle.BgGreen + head + LogStyle.Reset);
				console.log("\n");

			} else {
				let str: String = "  /!\\ Missing file \"./" + this._CONF_PATH + "\" /!\\  ";
				let head: string = str.replace(/./g, " ");
				console.log("\n");
				console.log(LogStyle.BgRed + head + LogStyle.Reset);
				console.log(LogStyle.Bright + LogStyle.BgRed + LogStyle.FgWhite + str + LogStyle.Reset);
				console.log(LogStyle.BgRed + head + LogStyle.Reset);
				console.log("\n");
				this._ENV_NAME = "dev";
			}
		}

		//Get the data from hashmap
		if (map[this._ENV_NAME]) return map[this._ENV_NAME];
		return map[Object.keys(map)[0]];
	}
}

type EnvName = "dev" | "preprod" | "prod";