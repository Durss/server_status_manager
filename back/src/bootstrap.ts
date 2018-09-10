import Server from "./server/Server";
import Config from "./utils/Config";

let server = new Server(Config.SERVER_PORT);
//See src/controllers folder content
server.loadController(Config.CONTROLLERS_PATH + "/*.js").listen();