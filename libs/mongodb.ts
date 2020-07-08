import Promise from 'bluebird';
import Mongoose from 'mongoose';
const mongoose = Promise.promisifyAll(Mongoose);
mongoose.Promise = Promise;
import Utils from './utils';
const mongoConfig = require(Utils.configDir + 'mongodb.json');

function buildConnStr(config: any){
    let connectStr = 'mongodb://';
    if(config && config.uri){
        connectStr = config.uri;
    } else if (config && config.replication) {
        if (config.user) {
            connectStr += connectStr + config.user + ':' + config.pwd + '@';
        }
        config.servers.forEach((server: any)=> {
            connectStr += server.host + ':' + server.port + ',';
        });
        connectStr = connectStr.substring(0, connectStr.length - 1);
        connectStr += '/' + config.db + '?replicaSet=' + config.replication;
    }else{
        if (config.user) {
            connectStr += connectStr + config.user + ':' + config.pwd + '@' + config.host + ':' + config.port + '/' + config.db;
        } else {
            connectStr += config.host + ':' + config.port + '/' + config.db;
        }
    }
    return connectStr;
}

function connect2db(connectStr: string) {
    // log(connectStr);
    let options = {
        // promiseLibrary: Promise,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        poolSize: 100,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        bufferMaxEntries: 0,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        useNewUrlParser: true
        // mongos: true
    }
    const db = new mongoose.Mongoose();
    // db.set('bufferCommands', false);
    const conn = db.createConnection(connectStr, options);
    conn.on('connected', function(){
        console.log('mongodb connected to %s', connectStr);
    });
    conn.on('disconnected', function(){
        console.error(Utils.datetimeFormat() + ' mongodb连接断开[' + connectStr + ']，重试中。。。\t');
    });
    conn.on('error', function(e){
        console.error(Utils.datetimeFormat() + ' mongodb连接出错[' + connectStr + ']：\n' + (e.stack || e));
    });
    return {mongoose: db, conn: conn};
}

export = {
    mongo: connect2db(buildConnStr(mongoConfig.db))
};