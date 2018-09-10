import PingHistoryData from '@/vo/PingHistoryData';

export default interface ApiServiceData {
	_id:string;
	updated_at:string;
	created_at:string;
	title: string;
	url: string;
	selector: string;
	expectedContent: string;
	pingHistory: PingHistoryData[];
}