import { RouterMode } from 'vue-router';
/**
 * Created by Durss
 */
export default class Config {
	
	public static get BASE_URL():string {
		return "http://localhost:3023";
	}
	
	public static get API_PATH():string{
		return "http://localhost:3023";
	};
	
	public static MAX_IMAGE_WIDTH:number = 1500;
	public static MAX_IMAGE_HEIGHT:number = 1500;
	
	public static get UPLOAD_DIR():string{
		return "uploads/";
	};
	
	public static get ROUTER_MODE():RouterMode{
		return "hash";//history
	};
	
	public static get RESOURCES_ROOT():string{
		return "/";
	};
	
	public static get SOCKET_PATH():string{
		return "http://localhost:3024/sock";
	};
	
}