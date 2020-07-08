import fs from 'fs';
import path from 'path';
import moment from 'moment';
import Promise from 'bluebird';
import crypto from 'crypto';
// import superagent from 'superagent';
import child_process from 'child_process';

class Utils{

    public env = '';
    public configDir = '';

    constructor(){

        this.env = (function () {
            console.log('env:' + process.env.NODE_ENV);
            return !process.env.NODE_ENV ? 'test' : process.env.NODE_ENV;
        })();

        this.configDir = this.getDir(this.env);
    }
    // global.log = function () {
    //     // try{
    //     //     let array = Array.from(arguments);
    //     //     array[0] = '[processId:' + process.env.pm_id + '] ' + array[0];
    //     //     console.log.apply(this, array);
    //     // }catch(e){
    //     //     console.log.apply(this, arguments);
    //     // }
    //     console.log.apply(this, arguments);
    // };
    // global.warn = function (m) {
    //     console.warn.apply(this, arguments);
    // };
    // global.error = function () {
    //     console.log.apply(this, arguments);
    //     console.error.apply(this, arguments);
    // };

    getDir(env: string){
        var path = process.cwd() + '/config.test/';
        if (env == 'production') {
            path = process.cwd() + '/config.production/';
        }
        // console.log(path);
        return path;
    }
    
    delay(t: number, v: any){
       return new Promise(function(resolve){
           setTimeout(resolve.bind(null, v), t);
       });
    }
    
    checkEmail(email: String) {
        return email.match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)
    };
    checkPhone(phone: String) {
        return phone.match(/^1[3|4|5|8|7][0-9]\d{4,8}$/);
    };
    
    isArray(array: Number[]) {
        return Object.prototype.toString.call(array) === '[object Array]';
    };
    
    maxOfArray(array: number[]){ 
        return Math.max.apply(Math, array);
    };
    
    inArray(element: Number | String, array: Array<Number | String>){
        for(var i = 0; i < array.length; i++){
            if(element === array[i]){
                return true;
            }
        }
        return false;
    };
    
    /**
     * 数组去重
     */
    // unique(array: Array<Number | String>){
    //     var res = [];
    //     var json = {};
    //     for(var i = 0; i < array.length; i++){
    //         if(!json[array[i]]){
    //             res.push(array[i]);
    //             json[array[i]] = 1;
    //         }
    //     }
    //     return res;
    // }
    
    /**
     * 随机数，范围[n,m]
     */
    random(n: number, m: number) {
        return Math.floor(Math.random() * (m - n + 1) + n);
    }
    
    //字符串的md5值
    md5(str: string) {
        str = str.toString();
        var buf = Buffer.alloc(1024);
        var len = buf.write(str, 0);
        str = buf.toString('binary', 0, len);
        return crypto.createHash('md5').update(str).digest('hex');
    }
    
    //文件的md5值（同步方法获取文件，不适用大文件）
    getMD5(path: string) {
        var str = fs.readFileSync(path, 'binary');
        return crypto.createHash('md5').update(str).digest('hex');
    };
    
    Hmac(key: string, str: string) {
        // var Buffer = require('buffer').Buffer;
        // var buf = new Buffer(1024);
        // var len = buf.write(str, 0);
        // str = buf.toString('binary', 0, len);
        return crypto.createHmac('sha1', key).update(str).digest();
    };
    
    // utils.sha1(str) {
    //     return crypto.createHash('sha1').update(str, 'utf8').digest('hex');
    // };
    sha1(str: string) {
        var md5sum = crypto.createHash('sha1');
        md5sum.update(str, 'utf8');
        str = md5sum.digest('hex');
        return str;
    };
    
    dateFormat(date?: Date) {
        var res = moment(date).format('YYYY-MM-DD');
        return res == 'Invalid date' ? '' : res;
    };
    datetimeFormat(time?: Date) {
        var res = moment(time).format('YYYY-MM-DD HH:mm:ss');
        return res == 'Invalid date' ? '' : res;
    };
    
    //获取昨天日期，格式：2016-03-02
    yesterday(date: Date){
        var d = new Date();
        if(date){
            d = new Date(date);
        }
        d.setDate(d.getDate() - 1);
        return this.dateFormat(d);
    }
    
    //获取明天日期，格式：2016-03-02
    tomorrow(date: Date){
        var d = new Date();
        if(date){
            d = new Date(date);
        }
        d.setDate(d.getDate() + 1);
        return this.dateFormat(d);
    }
    
    /**
     * 异步递归创建目录
     */
    mkdir(dist: string, callback: Function) {
        dist = path.resolve(dist);
        fs.exists(dist, (exists) => {
            if (!exists) {
                this.mkdir(path.dirname(dist), function () {
                    fs.mkdir(dist, function (err) {
                        callback && callback(err);
                    });
                });
            } else {
                callback && callback(null);
            }
        });
    };
    
    //执行shell脚本
    execShell(cmd: string){
        console.log(cmd);
        return new Promise(function(resolve, reject){
            child_process.exec(cmd, function(e, stdout, stderr){
                if(e){
                    reject(e);
                }else{
                    resolve(stdout);
                }
            });
        });
    }
    
    // shell(cmd: string, args){
    //     var child = child_process.spawn(cmd, args);
    //     return child;
    // }
    
    getTotalPageCount(totalRecordCount: number, pageSize: number){
        let totalPageCount = Math.ceil(totalRecordCount / pageSize);
        totalPageCount = Math.max(totalPageCount, 1);
        return totalPageCount;
    }
}

export default new Utils();
