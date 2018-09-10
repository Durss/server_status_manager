/**
 * Created by fdursus
 */
export default class AssetsManager {

	private static _instance:AssetsManager;
	private _codeToFile:{[id:string]:AssetManagerData} = {};

	constructor() {
		this.initialize();
	}


	/********************
	 * GETTER / SETTERS *
	 ********************/
	/**
	 * Gets the singleton's reference
	 */
	public static get instance():AssetsManager {
		if(!this._instance) this._instance = new AssetsManager();
		return this._instance;
	}



	/******************
	 * PUBLIC METHODS *
	 ******************/
	public preloadImage(code:string, url:string):Promise<any> {
		return new Promise((resolve, reject) => {
			let image:HTMLImageElement = document.createElement("img");
			image.src = url;
			image.setAttribute('crossOrigin', 'anonymous');
			image.onload = (test)=> {
				if(url.indexOf("svg")>-1) {
					//if it's an SVG, just count on browser's cache to serve it faster
					resolve();
					return;
				}
				// Create an off-screen canvas to render the image and get b64 data
				let cnvOff		= document.createElement('canvas');
				let ctxOff		= cnvOff.getContext('2d');
				cnvOff.width	= image.width;
				cnvOff.height	= image.height;
				let data:string;
				try {
					(<CanvasRenderingContext2D >ctxOff).drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
					data = cnvOff.toDataURL();
				}catch(e) {
					console.warn("There's an issue with image cross-origin on file "+url);
					console.log(e);
					data = url;//fallback
				}
				
				this._codeToFile[code] = {
					width:image.width,
					height:image.height,
					b64:data,
					img:image,
					url:url,
				}

				resolve();
			}
		})
	}

	public getImageByCode(code:string):AssetManagerData {
		return this._codeToFile[code];
	}



	/*******************
	 * PRIVATE METHODS *
	 *******************/
	/**
	 * Initializes the class
	 */
	private initialize():void {
	}
}

export interface AssetManagerData {
	width:number;
	height:number;
	b64:string;
	url:string;
	img:HTMLImageElement;
}