// stock.js
'use strict';

var request = require('request');

class Stock {
    constructor(config, TOKEN) {
        this.config = config;
        this.response;
        this.params = {"apikey": TOKEN, "datatype": "json"};
        this.headers = {"User-Agent": "request"};
        this.url = this.config.tracker.endpoint;
    }

    fetch(obj) {
        this.build_params(obj);
        request.get({url: this.url, json: true, headers: this.headers, qs: this.params}, function(err, res, data) {
            if (err) {
                console.log("Error:", err); return;
            } else if (res.statusCode !== 200) {
                console.log("Status:", res.statusCode);
            } else {
                this.response = data
            }
            console.log(this.response)
        }); 
    }

    build_params(obj, clean=false) {
        if (clean) {
            this.params = {};
        } else {
            for (let p in obj) {
                this.params[p] = obj[p];
            }
        }
    }
}

module.exports.Stock = Stock
