export default class Api {
	public static buildResponse<T>(data:T): { status:number, success: boolean, data: T } {
		return { status:200, success: true, data: data };
	}
	public static buildError(status: number, code: string, message: string): { success: boolean, status: number, code: string, message: string } {
		return { success: false, status: status, code: code, message: message };
	}
}