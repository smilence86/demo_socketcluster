import mongodb from '../libs/mongodb';
const mongoose = mongodb.mongo.mongoose;
const conn = mongodb.mongo.conn;

const schema = new mongoose.Schema({
    _id: String,
    company_id: String,
    name: String,
    members: Object,
    status: Number,
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: Date.now }
},{versionKey: false});

const model =  conn.model('group', schema);

export default model;