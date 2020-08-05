var Utils = require("./utils")
var request = require('request');
var moment = require('moment');
var Tables = require("./tables");

var Boodskap = function (app, token) {
    this.API_URL = app.conf.settings.boodskap.apiUrl;
    this.DOMAIN_KEY = app.conf.settings.boodskap.domainKey;
    this.API_KEY = app.conf.settings.boodskap.apiKey;
    this.API_TOKEN = token ? token : this.DOMAIN_KEY + ":" + this.API_KEY;
    this.utils = new Utils(app);
    this.table = new Tables(app);
    this.logger = app.logger;
};
module.exports = Boodskap;

Boodskap.prototype.startSession = function (req, res) {

    const self = this;
    var sessionObj = {
        success: true,
        Result:
        {
            EmailAddress: req.body.email.toLowerCase(),
            User: req.body.email.toLowerCase(),
            Auth: req.sessionID
        },
        login: true,
        Session:
        {
            SessionId: req.sessionID,
        }
    };
    // var data = {
    //     "domainKey": self.DOMAIN_KEY,
    //     "apiKey": self.API_KEY,
    //     "userId": sessionObj['Result']['User'],
    //     "token": sessionObj['Result']['Auth'],
    //     "expireAt": new Date(moment().add(5, 'hours')).getTime()
    // }
    var data = {
        email : req.body['email'],
        password: req.body['password'],
        targetDomainKey: self.DOMAIN_KEY
    }

    self.doLogin(data, function (status, result) {
        if (status) {
            sessionObj['boodskap'] = result;
            req.session['sessionObj'] = sessionObj;
            res.json({
                login: true,
                result: result
            });
        } else {
            self.clearSession(req)
            res.json({
                login: false,
                message: 'Error in Authenticating with Platform API',
                error: result
            })
        }
    });

}


Boodskap.prototype.clearSession = function (req) {

    req.session['sessionObj'] = null;
    req.session['user_session'] = null;
    req.session['challenges'] = null;
    req.session['challengeId'] = null;

}

Boodskap.prototype.login = function (data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/auth/push/token',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.logger.error(JSON.parse(res.body))
                cbk(false, JSON.parse(res.body))
            }
        } else {
            self.logger.error(err)
            cbk(false, null)
        }

    });
};

Boodskap.prototype.logout = function () {

    const self = this;

    request.get({
        uri: self.API_URL + '/domain/logout/' + self.API_TOKEN,
        headers: {
            'content-type': 'application/json'
        },
    }, function (err, res, body) {

        if (!err) {

        } else {

        }

    });
};

Boodskap.prototype.doLogin = function (data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/domain/login',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if(!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.logger.error(res.body)
                cbk(false, res.body)
            }
        }else{
            self.logger.error(err)
            cbk(false,null)
        }

    });
};

Boodskap.prototype.elasticInsert = function (rid, data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/record/insert/dynamic/' + self.API_TOKEN + '/' + rid,
        headers: {
            'content-type': 'text/plain'
        },
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                cbk(false, JSON.parse(res.body))
            }
        } else {
            self.logger.error("Error in elastiInsert=>", err)
            cbk(false, null)
        }

    });
};

Boodskap.prototype.elasticUpdate = function (rid, rkey, data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/record/insert/static/' + self.API_TOKEN + '/' + rid + '/' + rkey,
        headers: {
            'content-type': 'text/plain'
        },
        body: JSON.stringify(data),
    }, function (err, res, body) {
        if (!err) {
            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.logger.error("Error in elasticUpdate=>", JSON.parse(res.body))
                cbk(false, JSON.parse(res.body))
            }
        } else {
            self.logger.error("Error in elasticUpdate=>", err)
            cbk(false, null)
        }

    });
};

Boodskap.prototype.elasticDelete = function (rid, rkey, cbk) {

    const self = this;

    request.delete({
        uri: self.API_URL + '/record/delete/' + self.API_TOKEN + '/' + rid + '/' + rkey,
        headers: {
            'content-type': 'text/plain'
        },
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.logger.error("Error in elasticDelete=>", JSON.parse(res.body))
                cbk(false, JSON.parse(res.body))
            }
        } else {
            self.logger.error("Error in elasticDelete=>", err)
            cbk(false, null)
        }

    });
};

Boodskap.prototype.elasticSearch = function (rid, query, cbk) {

    const self = this;

    var obj = {
        "type": "RECORD",
        "query": JSON.stringify(query)
    }

    if (rid) {
        obj['specId'] = rid;
    }
    request.post({
        uri: self.API_URL + '/elastic/search/query/' + self.API_TOKEN,
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(obj),

    }, function (err, res, body) {
        if (!err) {
            if (res.statusCode === 200) {

                var resultObj = self.utils.elasticQueryFormatter(JSON.parse(res.body))
                cbk(true, resultObj);
            } else {
                self.logger.error("Error in elasticDelete=>", JSON.parse(res.body))
                cbk(false, JSON.parse(res.body))
            }
        } else {
            self.logger.error("Error in elasticSearch=>", err)
            cbk(false, null)
        }

    });
};

Boodskap.prototype.executeTemplateScript = function (templateName, data, cbk) {

    const self = this;

    var templateObj = {
        "sessionId": self.utils.generateUUID(),
        "template": templateName,
        "templateArgs": JSON.stringify(data),
        "scriptArgs": "{}"
    };


    self.logger.error('For debug purpose templatename => ' + templateName)

    request.post({
        uri: self.API_URL + '/call/execute/template/' + self.API_TOKEN,
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(templateObj),
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                var resultData = JSON.parse(res.body);
                var formattedData = self.utils.dbQueryFormatter(resultData);
                if (formattedData.error) {
                    self.logger.error("Error in Query Execute =>", formattedData.error)
                    cbk(false, formattedData)
                } else {
                    cbk(true, formattedData)
                }

            } else {
                var resultData = JSON.parse(res.body)
                self.logger.error("Error in Template Execute =>", resultData)
                cbk(false, JSON.parse(res.body))
            }
        } else {
            self.logger.error("Error in Template Execute =>", err)
            cbk(false, null)
        }

    });
};

Boodskap.prototype.upsertUser = function (data, cbk) {

    const self = this;

    request.post({
        uri: self.API_URL + '/user/upsert/' + self.API_TOKEN,
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.logger.error(err)
                cbk(false, JSON.parse(res.body))
            }
        } else {
            self.logger.error(err)
            cbk(false, null)
        }

    });
};

Boodskap.prototype.retrieveUser = function (userid, cbk) {

    const self = this;

    request.get({
        uri: self.API_URL + '/user/get/' + self.API_TOKEN + '/' + userid,
        headers: {
            'content-type': 'application/json'
        },
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.logger.error(err)
                cbk(false, JSON.parse(res.body))
            }
        } else {
            self.logger.error(err)
            cbk(false, null)
        }

    });
};

Boodskap.prototype.getDomainProperty = function (id, cbk) {

    const self = this;

    request.get({
        uri: self.API_URL + "/domain/property/get/" + self.API_TOKEN + "/" + id,
    }, function (err, res, body) {
        if (!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.logger.error(err)
                cbk(false, JSON.parse(res.body))
            }
        } else {
            self.logger.error(err)
            cbk(false, null)
        }

    });
};

Boodskap.prototype.setDomainProperty = function (data) {

    const self = this;

    request.post({
        uri: self.API_URL + "/domain/property/upsert/" + self.API_TOKEN,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
    }, function (err, res, body) {
        if (!err) {
        } else {
            self.logger.error(err)
        }
    });
};

Boodskap.prototype.executeNamedRule = function (ruleName, obj, cbk) {

    const self = this;

    var requestToURL = self.API_URL + '/call/execute/rule/' + self.DOMAIN_KEY + ":" + self.API_KEY;

    request.post({
        url: requestToURL,
        body: JSON.stringify({
            sessionId: self.utils.generateUUID(),
            scriptArgs: JSON.stringify(obj),
            namedrule: ruleName
        }),
        headers: {
            'content-type': 'application/json'
        }
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var response = JSON.parse(body);
            var msg = JSON.parse(response.jsonResult);

            if (msg.error) {
                cbk(false, null);
            } else {
                cbk(true, (msg ? msg : ''));
            }


        } else {
            self.logger.error(err)
            cbk(false, null);
        }

    });
};

Boodskap.prototype.deleteUser = function (email, cbk) {

    const self = this;

    request.delete({
        uri: self.API_URL + '/user/delete/' + self.API_TOKEN + '/' + email,
        headers: {
            'content-type': 'application/json'
        },
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                cbk(true, JSON.parse(res.body))
            } else {
                self.logger.error(err)
                cbk(false, JSON.parse(res.body))
            }
        } else {
            self.logger.error(err)
            cbk(false, null)
        }

    });
};

Boodskap.prototype.pushMessage = function (data, mid) {

    const self = this;

    var did = 'GATEKEEPER';
    var dmid = 'DTA';
    var version = '1.0.0';

    request.post({
        uri: self.API_URL + '/push/raw/' + self.DOMAIN_KEY + '/' + self.API_KEY + '/' + did + '/' + dmid + '/' + version + '/' + mid + '?type=JSON',
        headers: {
            'content-type': 'text/plain'
        },
        body: JSON.stringify(data),
    }, function (err, res, body) {
        if (!err) {
            if (res.statusCode === 200) {
            } else {
                self.logger.error(err)
            }
        } else {
            self.logger.error(err)
        }
    });
};

Boodskap.prototype.pushBinaryRule = function (data, ruleName) {

    const self = this;

    var did = 'GATEKEEPER';
    var dmid = 'DTA';
    var version = '1.0.0';

    request.post({
        uri: self.API_URL + '/push/bin/json/' + self.DOMAIN_KEY + '/' + self.API_KEY + '/' + did + '/' + dmid + '/' + version + '/' + ruleName,
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data),
    }, function (err, res, body) {
        if (!err) {
            if (res.statusCode === 200) {
            } else {
                self.logger.error(err)
            }
        } else {
            self.logger.error(err)
        }
    });
};

Boodskap.prototype.uploadFile = function (data, cbk) {

    const self = this;
    var file = data.files.binfile;
    var req = request.post(self.API_URL + "/files/upload/" + self.API_TOKEN + '?ispublic=false', function (err, result, body) {
        if (!err) {
            cbk(true, JSON.parse(result.body));
        } else {
            cbk(false, "Failed to upload");
        }
    });

    var form = req.form();
    form.append('binfile', file.data, {
        filename: file.name,
        contentType: file.mimetype
    });
    form.append("mediaType", file.mimetype);
    form.append("tags", 'sr-form');
    form.append("description", '');
};