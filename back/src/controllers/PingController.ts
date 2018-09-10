import { ApiService, IApiServiceModel } from './../db/models/apiservice/ApiServiceModel';
import Api from '../server/Api';
import Config from '../utils/Config';
import * as express from "express";
import { NextFunction, Request, Response } from "express-serve-static-core";
import * as puppeteer from "puppeteer";
import * as fs from "fs";

import {
	ERequest, EResponse, ErrorHandler, GET, IRoute, param,
	Router,
} from "../server/ExpressAnnotations";
import Utils from '../utils/Utils';
import Logger from '../utils/Logger';

@Router({ route: Config.SERVER_NAME + "/api/v1/ping", json: true })
export class PingController implements IRoute {

	router: express.Router;

	@GET({ path: "/", status: true, noResponse: true })
	private indexGet(@ERequest() request: Request, @EResponse() response: Response): Promise<any> {
		return new Promise((resolve, reject) => {
			response.status(200);
			response.json(Api.buildResponse("service up and running"));
		});
	}

	@GET({ path: "/:id", status: true, noResponse: true })
	private idGet(@ERequest() request: Request, @EResponse() response: Response, @param("id") id: string): Promise<any> {
		//Executes a ping of one specific service by its ID
		return new Promise((resolve, reject) => {
			//Search for service on DB
			ApiService.findById(id).then((dbEntry: IApiServiceModel) => {
				//Create folder hierarchy that will hold the extracted PNG images.
				//Folder will have this structur :
				//upload/{SERVICE_TITLE}_{SERVICE_ID}/{CURRENT_DATE}/{TIMESTAMP}_{INDEX}.png
				let folder:string = Config.UPLOAD_DIR + Utils.slugify(dbEntry.title)+"_"+dbEntry._id+"/";
				if(!fs.existsSync(folder)) {
					fs.mkdirSync(folder);
				}

				let d = new Date();
				folder += d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear()+"/";
				if(!fs.existsSync(folder)) {
					fs.mkdirSync(folder);
				}

				(async () => {
					//Instanciate chromium an load page
					const browser = await puppeteer.launch({
						args: ["--no-sandbox", "--disable-web-security"]
					});
					const page = await browser.newPage();
					page.on('console', console.log);//Reroot inner logs to console
					await page.goto(dbEntry.url);
					await page.waitForSelector(dbEntry.selector);
					
					//The following async method forces the display of all the hidden elements
					//By rmeoving some CSS properties
					await page.evaluate(() => {
						let cssSheets = document.styleSheets;
						for (let i: number = 0; i < cssSheets.length; i++) {
							let s = <CSSStyleSheet>cssSheets[i];
							if(s.cssRules) {
								for (let j: number = 0; j < s.cssRules.length; j++) {
									let rule = <CSSStyleRule>s.cssRules[j];
									if(rule.style) {
										//Remove "display", "visible" and "overflow" properties if
										//they hide something
										if(rule.style.getPropertyValue("display") == "none") {
											rule.style.removeProperty("display")
										}
										if(rule.style.getPropertyValue("visibility") == "hidden") {
											rule.style.removeProperty("visibility")
										}
										if(rule.style.getPropertyValue("overflow") == "hidden") {
											rule.style.removeProperty("overflow")
										}
									}
								}
							}
						}
					});

					//Extract all the elements bounding rects and their text content
					const elements = await page.evaluate((dbEntry) => {
						let elements = Array.from(document.querySelectorAll(dbEntry.selector));
							let res = elements.map(element => {
							const { x, y, width, height } = element.getBoundingClientRect();
							return {rect:{ left: x, top: y, width, height, id: element.id }, text:element.textContent}
						})
						return res;
					}, dbEntry);
					

					let index:number = 0;
					let padding:number = 15;
					let screenshots:string[] = [];
					//Extract a PNG for every single DOM elements
					for(let i:number=0; i < elements.length; i++) {
						if(!elements[i].rect) continue;
						let screenPath: string = folder + "_" + new Date().getTime() + "_" + (i+1) + ".png";
						screenshots.push(screenPath);
						let rect = elements[i].rect;
						await page.screenshot({
							path:screenPath,
							clip: {
								x: rect.left - padding,
								y: rect.top - padding,
								width: rect.width + padding * 2,
								height: rect.height + padding * 2
							}
						});
					}
					
					//destroy headless browser to free memory
					await browser.close();
					
					//Answer to client
					response.status(200);
					response.json(Api.buildResponse(screenshots));
				})();
			});
		});
	}

	@ErrorHandler
	private errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
		Logger.error(error);
		res.status(500);
		res.json({ status: 500, error: error.toString() });
	}

}