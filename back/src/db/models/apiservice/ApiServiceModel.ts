import { Document, Schema, Model, model } from "mongoose";
import IApiService from "./IApiService";

export interface IApiServiceModel extends IApiService, Document {
}

export var ApiServiceSchema: Schema = new Schema({
		__v: { type: Number, select: false },
		created_at: Date,
		updated_at: Date,
		title: String,
		url: String,
		selector: String,
		expectedContent: String,
		pingHistory: [{
            type: Schema.Types.ObjectId,
            ref: 'PingHistory'
        }],
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
	}
);

export const ApiService: Model<IApiServiceModel> = model<IApiServiceModel>("ApiService", ApiServiceSchema);