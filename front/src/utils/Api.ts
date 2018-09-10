import Config from '@/utils/Config';
import ApiResult from '@/vo/ApiResult';

export default class Api {
	private api_version = 'v1';

	public static get(endpoint: string, params: any = null, headers: any = null, setDefaultheader:boolean = true): Promise<ApiResult<any>> {
		return this._call(endpoint, params, headers, 'GET', setDefaultheader);
	}
	public static post(endpoint: string, params: any = null, headers: any = null, setDefaultheader:boolean = true): Promise<ApiResult<any>> {
		return this._call(endpoint, params, headers, 'POST', setDefaultheader);
	}
	public static delete(endpoint: string, params: any = null, headers: any = null, setDefaultheader:boolean = true): Promise<ApiResult<any>> {
		return this._call(endpoint, params, headers, 'DELETE', setDefaultheader);
	}

	protected static _call(endpoint: string, params: any = null, headers: any = null, verb: string = 'GET', setDefaultheader:boolean = true, api_version: string = 'v1'): Promise<ApiResult<any>> {

		let _headers:any = {};
		if(setDefaultheader) {
			_headers["Content-Type"] = "application/json";
		}
		if (headers) {
			// TODO add custom headers !
			for(let key in headers) {
				_headers[key] = headers[key];
			}
		}
		var options = {
			// host: document.location.hostname,
			// port: Config.API_PORT,
			// path: '/api/' + api_version + endpoint,
			method: verb,
			headers: _headers
			//data: 'username=' + login + '+password=' + pass,
		};
		
		let url = Config.API_PATH + '/api/' + api_version + endpoint;
		if (verb == 'GET' && params != null) {
			let chunks = [];
			for (let key in params) {
				chunks.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
			}
			url += (url.indexOf("?") == -1? "?" : "") + chunks.join("&");
			params = null;
		}
		// let url = "//" + document.location.hostname + ":" + Config.API_PORT + '/api/' + api_version + endpoint;
		params = (params && _headers["Content-Type"] == "application/json" && typeof params != "string") ? JSON.stringify(params) : params;
		return this._sendRequest(url, options, params);
	}



	protected static _sendRequest(url:string, options: any, bodyParams: string|null = null): Promise<ApiResult<any>> {
		return new Promise((resolve, reject) => {
			if(bodyParams) {
				options.body = bodyParams;
			}
			fetch(url, options)
			.then((result) => {
				if(result.status == 200) {
					result.json().then((json)=> {
						if(json.success === false) {
							console.log(json)
							reject(json);
						}else{
							resolve(json);
						}
					})
				}else{
					result.json().then((json)=> {
						reject(json);
					});
				}
			}).catch((error) => {
				reject(error);
			});
		});
    }
}