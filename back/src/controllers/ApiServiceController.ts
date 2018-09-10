import { ApiService } from './../db/models/apiservice/ApiServiceModel';
import Api from '../server/Api';
import Config from '../utils/Config';
import Logger from '../utils/Logger';
import * as express from "express";
import { NextFunction, Request, Response } from "express-serve-static-core";

import {
	ERequest, EResponse, ErrorHandler, GET, IRoute, POST, 
	Router,
	DELETE
} from "../server/ExpressAnnotations";
import IApiService from '../db/models/apiservice/IApiService';

@Router({ route: Config.SERVER_NAME + "/api/v1/apiservice", json: true })
export class ApiServiceController implements IRoute {

	router: express.Router;

	@GET({ path: "/" , status:true, noResponse:true})
	private indexGet(@ERequest() request : Request, @EResponse() response : Response): Promise<any> {
		//Get all the api services registered
		return new Promise((resolve, reject) => {
			ApiService.find().then((services) => {
				response.status(200);
				response.json({ status: 200, data: services });
				resolve();
			}).catch((error) => {
				Logger.error(error);
				reject(Api.buildError(500, "db_load_entries", "Unable to load services list from database..."));
			})
		});
	}

	@POST({ path: "/" , status:true, noResponse:true})
	private indexPost(@ERequest() request : Request, @EResponse() response : Response): Promise<any> {
		//Add a new api service to DB
		return new Promise((resolve, reject) => {
			console.log(request.body.title);
			//Create DB entry
			let dbEntry:IApiService = {
				title: request.body.title,
				url: request.body.url,
				selector: request.body.selector,
				expectedContent: request.body.expectedContent,
				pingHistory:[],
			}
			//Save it to DB
			ApiService.create(dbEntry).then((result:IApiService) => {
				Logger.success("New service saved successfully");
				response.status(200);
				response.json(Api.buildResponse(result));
				resolve();
			}).catch((e)=> {
				Logger.error(e);
				reject(Api.buildError(500, "db_save_entries", "Unable to save new service to database..."));
			})
		});
	}

	@DELETE({ path: "/" , status:true, noResponse:true})
	private indexDelete(@ERequest() request : Request, @EResponse() response : Response): Promise<any> {
		//Delete a db entry
		return new Promise((resolve, reject) => {
			ApiService.deleteOne({_id:request.body.id}).then((item) => {
				Logger.success("Entry deleted "+request.body.id);
				response.status(200);
				response.json(Api.buildResponse(true));
				resolve();
			}).catch((error) => {
				Logger.error("Error while deleting item !");
				response.status(500);
				response.json(Api.buildError(500, "item_not_found", "Deleted item has not been found on DB !"));
				resolve();
			})
		})
	}

	@ErrorHandler
	private errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
		Logger.error(error);
		res.status(500);
		res.json({ status: 500, error: error.toString() });
	}
}