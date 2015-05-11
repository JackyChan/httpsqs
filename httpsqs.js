/**
 * httpsqs client
 *
 * use example:
 * var httpsqs = require('httpsqs')();
 * httpsqs.get('queueName', function(data){});
 *
 * or
 *
 * var httpsqs = require('httpsqs');
 * var client = new httpsqs({host:'localhost',auth:'key'});
 * client.get('queueName', function(data){});
 *
 * @author Jacky
 */
var http = require('http');

module.exports = exports = function(opts){
	opts = opts || {};
	if (!opts['host']) {
		opts['host'] = '127.0.0.1';
	}
	if (!opts['port']) {
		opts['port'] = '1218';
	}
	if (!opts['auth']) {
		opts['auth'] = '';
	}
	if (!opts['charset']) {
		opts['charset'] = 'utf-8';
	}

	return new Httpsqs(opts);
};

function Httpsqs(opts) {
	this.settings = opts;
}

Httpsqs.prototype.requestGet = function(query, callback) {
	var auth = this.settings.auth;

	if (query['auth']) {
		auth = query['auth'];
		delete query['auth'];
	}

	if (!query['charset']) {
		query['charset'] = this.settings.charset;
	}

	var queryString = '/?auth='+auth;

	for (var name in query) {
		queryString += '&' + name+'='+query[name];
	}

	http.request({'hostname': this.settings.host, 'port': this.settings.port, 'path': queryString, 'method': 'GET'}, function (res) {
	    res.setEncoding('utf8');
	    var pos = res.headers['Pos'] || '0';
    	pos = pos.match(/\d+/) ? Number.parseInt(pos) : 0;
	    res.on('data', function (data) {
	    	callback && callback(null, {'data':data,'pos': pos});
	    });
	}).on('error', function(e){
		callback && callback(e);
	}).end();
}

Httpsqs.prototype.get = function(queueName, callback) {
	this.requestGet({'name': queueName, 'opt': 'get'}, function(err, res){
		var data = false;

		if (!err && res['data'] != 'HTTPSQS_ERROR' && res['data'] != 'HTTPSQS_GET_END') {
			data = res['data'];
		}

		callback && callback(data);
	});
};

Httpsqs.prototype.gets = function(queueName, callback) {
	this.requestGet({'name': queueName, 'opt': 'get'}, function(err, res){
		var data = false;

		if (!err && res['data'] != 'HTTPSQS_ERROR') {
			data = res;
		}

		callback && callback(data);
	});
};

Httpsqs.prototype.status = function(queueName, callback) {
	this.requestGet({'name': queueName, 'opt':'status'}, function(err, res){
		var data = false;

		if (!err && res['data'] != 'HTTPSQS_ERROR') {
			data = res['data'];
		}

		callback && callback(data);
	});
};

Httpsqs.prototype.view = function(queueName, queuePos, callback) {
	this.requestGet({'name': queueName, 'opt': 'view', 'pos': queuePos}, function(err, res){
		var data = false;

		if (!err && res['data'] != 'HTTPSQS_ERROR') {
			data = res['data'];
		}

		callback && callback(data);
	});
};

Httpsqs.prototype.reset = function(queueName, callback) {
	this.requestGet({'name': queueName, 'opt': 'reset', 'pos': queuePos}, function(err, res){
		var data = false;

		if (!err && res['data'] == 'HTTPSQS_RESET_OK') {
			data = true;
		}

		callback && callback(data);
	});
};

Httpsqs.prototype.maxqueue = function(queueName, num, callback) {
	this.requestGet({'name': queueName, 'opt': 'maxqueue', 'num': num}, function(err, res){
		var data = false;

		if (!err && res['data'] == 'HTTPSQS_MAXQUEUE_OK') {
			data = true;
		}

		callback && callback(data);
	});
};

Httpsqs.prototype.status_json = function(queueName, callback) {
	this.requestGet({'name': queueName, 'opt':'status_json'}, function(err, res){
		var data = false;

		if (!err && res['data'] != 'HTTPSQS_ERROR') {
			data = res['data'];
		}

		callback && callback(data);
	});
};

Httpsqs.prototype.synctime = function(num, callback) {
	this.requestGet({'name': 'httpsqs_synctime', 'opt':'synctime', 'num': num}, function(err, res){
		var data = false;

		if (!err && res['data'] != 'HTTPSQS_SYNCTIME_OK') {
			data = true;
		}

		callback && callback(data);
	});
};
