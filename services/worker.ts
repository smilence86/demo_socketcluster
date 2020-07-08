import { Server as httpServer } from "http";
import { Server as httpsServer } from "https";
import SCWorker from 'socketcluster/scworker';
import { SCServerSocket, SCServer } from 'socketcluster-server';
import express from 'express';
import serveStatic from 'serve-static';
import path from 'path';
import morgan from 'morgan';
import healthChecker from 'sc-framework-health-check';
import redis from '../libs/redis';

class Worker extends SCWorker {
    run() {
        let worker = this;
        console.log(`[worker started] workerId: ${worker.id}, workerPId:, ${process.pid}`);
        let environment = this.options.environment;

        let app = express();

        let httpServer: httpServer = this.httpServer;
        let scServer: SCServer = this.scServer;

        if (environment === 'dev') {
            app.use(morgan('dev'));
        }
        app.use(serveStatic(path.resolve(__dirname, '../public')));

        // Add GET /health-check express route
        healthChecker.attach(this, app);

        httpServer.on('request', app);

        let count = 0;

        /*
            In here we handle our incoming realtime connections and listen for events.
        */
        scServer.on('connection', (socket: SCServerSocket) => {
            console.log(`[Client connected] workerId: ${worker.id}, workerPId:, ${process.pid}, socketId: ${socket.id}`);

            socket.on('sampleClientEvent', (data) => {
                count++;
                console.log('Handled sampleClientEvent', data);
                scServer.exchange.publish('sample', count);
            });

            let interval = setInterval(() => {
                socket.emit('random', {
                    number: Math.floor(Math.random() * 5)
                });
            }, 1000);

            socket.on('disconnect', () => {
                clearInterval(interval);
            });

            socket.on('queryHistoryData', async () => {
                let megs = await redis.lrangeAsync('messages', 0, -1);
                socket.emit('historyMsg', megs);
            });

            socket.on('newMsg', (msg: any) => {
                console.log(msg);
                msg.createdAt = new Date();
                // redis.lpush('messages', JSON.stringify(msg));
                for(let i in scServer.clients){
                    console.log(scServer.clients[i].subscriptions);
                    // console.log(Object.keys(scServer.clients[i].subscriptions)[0]);
                    // scServer.clients[i].emit('newMsg', msg);
                    // scServer.exchange.publish(Object.keys(scServer.clients[i].channelSubscriptions)[0], msg);
                    // worker.scServer.exchange.publish(Object.keys(scServer.clients[i].channelSubscriptions)[0], msg);
                    worker.exchange.publish('room1', msg);
                }
                console.log(`客户端数量：${scServer.clientsCount}`);
            });


        });
    }
}

let worker = new Worker();
// console.log(worker.id);
