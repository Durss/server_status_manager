import { Document, Schema, Model, model } from "mongoose";
import IPingHistory from "./IPingHistory";

export interface IPingHistoryModel extends IPingHistory, Document {
}

export var PingHistorySchema: Schema = new Schema({
		__v: { type: Number, select: false },
		created_at: Date,
		updated_at: Date,
		nodes: [{
			screenshot:String,
			status:Boolean,
		}],
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
	}
);

export const PingHistory: Model<IPingHistoryModel> = model<IPingHistoryModel>("PingHistory", PingHistorySchema);