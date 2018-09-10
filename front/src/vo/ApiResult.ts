export default interface ApiResult<T> {
	success:boolean;
	status:number;
	data:T;
}