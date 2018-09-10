import IDocument from './../IDocument';
export default interface IPingHistory extends IDocument {
	nodes: {
		screenshot:string;
		status:boolean
	}[];
}