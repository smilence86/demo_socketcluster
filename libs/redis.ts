import Promise from 'bluebird';
import Redis, { RedisClient } from 'redis';
import Utils from './utils';
const config = require(Utils.configDir + 'redis.json');

// declare module 'redis' {
// 	export interface RedisClient extends NodeJS.EventEmitter {
// 		hdelAsync(...args: any[]): Promise<any>;
// 		// add other methods here
// 	}
// }

const client = Redis.createClient({
	host: config.db.host,
	port: config.db.port,
	// password: config.db.password
}) as Redis.RedisClient;

const redisClient: any = Promise.promisifyAll(client);

client.on('ready', function () {
    console.log('redis connected to %s:%d', config.db.host, config.db.port);
});

client.on('error', function (err) {
    console.error("Error " + err);
});

export default redisClient;