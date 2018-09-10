import Config from '../utils/Config';
import Logger from '../utils/Logger';
import Database from '../db/Database';
import { AbstractExpressServer } from "./AbstractExpressServer";
import bodyParser = require("body-parser");
import { Request, Response, NextFunction } from "express-serve-static-core";
import * as mongodb from "mongodb";
import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import * as historyFallback from "connect-history-api-fallback";
import * as http from "http";

export default class Server extends AbstractExpressServer {
	protected initError(error: any): void {
		Logger.error("Error happened !", error);
	}

	protected doPrepareApp(): void {
		//Create server
		let server = http.createServer(<any>this.app);
		
		//Create missing folders
		if(!fs.existsSync(Config.PUBLIC_PATH)) {
			fs.mkdirSync(Config.PUBLIC_PATH);
		}
		if(!fs.existsSync(Config.UPLOAD_DIR)) {
			fs.mkdirSync(Config.UPLOAD_DIR);
		}

		//Here for VueJS "history" navigation mode that changes
		//the URL of the page instead of just a hash. Actually not used
		this.app.use(historyFallback({
			index:'index.html',
			// verbose:true,
			rewrites: [
				{
					//Avoiding rewrites for API calls
					from: /.*\/api\/?.*$/,
					to: function(context) {
						return context.parsedUrl.pathname;
					}
				}
			],
		}));

		//Plugin to parse body POST requests
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		//Serve static files if necessary
		this.app.use(Config.SERVER_NAME+"/", express.static(path.join(__dirname, Config.PUBLIC_PATH)));//static files
		//CORS stuff for services
		this.app.all(Config.SERVER_NAME+'/api/v1/*', (req, res, next) => {
			// Set CORS headers
			if(req.headers.origin) {
				let allowedCrossOrigins:string[] = ["localhost"];
				for(let i of allowedCrossOrigins) {
					if(req.headers.origin.indexOf(i) > -1) {
						res.header("Access-Control-Allow-Origin", req.headers.origin);
					}
				}
			}
			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
			// Set custom headers for CORS
			res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,X-AUTH-TOKEN');
	
			if (req.method == 'OPTIONS') {
				res.status(200).end();
			} else {
				next();
			}
		});
	}

	protected listenHandler(): void {
		Logger.success("Server ready on port " + Config.SERVER_PORT + " :: server name \"" + Config.SERVER_NAME + "\"");
		Database.instance.connect().then(_ => this.onReady()).catch(_ => { });
	}


	protected errorHandler(error: any, req: Request, res: Response, next: NextFunction): any {
		Logger.error("Express error");
		console.log(error)
		return super.errorHandler(error, req, res, next);
	}

	private onReady(): void {
		
	}
}