import IDocument from './../IDocument';
import IPingHistory from '../pinghistory/IPingHistory';
export default interface IApiService extends IDocument {
	title: string;
	url: string;
	selector: string;
	expectedContent: string;
	pingHistory: IPingHistory[];
}