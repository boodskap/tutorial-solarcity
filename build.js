const request = require('request');
const moment = require('moment');
const async = require('async');
const _ = require('underscore');
const fs = require('fs');

/*******************************
 * Require Configuration
 ****************************/
var conf = {};
var platformConfig = {};

try {
    conf = require(process.env.HOME + '/config/solar-city-config');
    console.log(new Date() + ' | Solar City Configuration Loaded From Config');
} catch (e) {
    console.error(e);
    return;
}

const API_URL = conf.settings.boodskap.apiUrl;
const DOMAIN_KEY = conf.settings.boodskap.domainKey;
const API_KEY = conf.settings.boodskap.apiKey;
const API_TOKEN = DOMAIN_KEY + ':' + API_KEY;

const MESSAGE_RULE = ['mr-100', 'mr-1000', 'mr-1001'];
const NAMED_RULE = ['nr-GetDashboard', 'nr-GetOverallStatus', 'nr-GetRecentCommunities', 'nr-GetSpread', 'nr-GetTopCommunities', 'nr-ListRecords', 'nr-SearchRecords'];
const BINARY_RULE = ['br-BulkDataUploader'];
const JOB_RULE = ['jr-BulkInsertJob', 'jr-StatisticsUpdaterJob']

var BUILD_STATUS = true;

logger('BUILD', 'Process Started....');

async.series({
    messages: function (mCbk) {
        logger('MESSAGES', 'Uploading Message Definitions');

        var mFlag = true;

        fs.readFile('./import/messages.json', function (err, data) {
            if (err) {
                logger('ERROR', err)
                logger('MESSAGES', 'Error in Messages upload!')
                mCbk(err, null)
            } else {
                var str = data.toString();
                var obj = JSON.parse(str);
                async.filter(obj, function (dat, fCbk) {
                    insertMessages(dat, function (stat, result) {
                        if (!stat) {
                            mFlag = false;
                        }
                        fCbk(null, null)
                    })
                }, function (er, res) {
                    if (mFlag) {
                        logger('MESSAGES', 'Messages uploaded successfully')
                    } else {
                        logger('MESSAGES', 'Error in Messages upload!')
                    }
                    mCbk(null, null)
                })
            }
        });
    },
    records: function (rCbk) {
        logger('RECORDS', 'Uploading Record Definitions')

        var rFlag = true;

        fs.readFile('./import/records.json', function (err, data) {
            if (err) {
                logger('ERROR', err)
                logger('RECORDS', 'Error in Records upload!')
                rCbk(err, null)
            } else {
                var str = data.toString();
                var obj = JSON.parse(str);
                async.filter(obj, function (dat, fCbk) {
                    insertRecords(dat, function (stat, result) {
                        if (!stat) {
                            rFlag = false;
                        }
                        fCbk(null, null)
                    })
                }, function (er, res) {

                    if (rFlag) {
                        logger('RECORDS', 'Records uploaded successfully')
                    } else {
                        logger('RECORDS', 'Error in Records upload!')
                    }
                    rCbk(null, null)
                })
            }
        });
    },
    messageRule: function (mrCbk) {
        logger('MESSAGE RULE', 'Uploading Message Rules');

        var mrFlag = true;

        if (MESSAGE_RULE.length > 0) {
            async.mapSeries(MESSAGE_RULE, function (rule, rCbk) {

                fs.readFile('./import/' + rule + '.json', function (err, data) {
                    if (err) {
                        logger('ERROR', err)
                        logger('MESSAGE RULE', 'Error in Message Rules upload!')
                        rCbk(err, null)
                    } else {
                        var str = data.toString();
                        var obj = JSON.parse(str);

                        updateMessageRule(obj.data, function (status, dat) {
                            if (!status) {
                                mrFlag = false;
                            }
                            rCbk(null, null)
                        })

                    }
                });
            }, function (rerr, rres) {

                if (mrFlag) {
                    logger('MESSAGE RULE', 'Message Rules uploaded successfully');
                } else {
                    logger('MESSAGE RULE', 'Error in Message Rules upload!')
                }
                mrCbk(null, null)
            })
        } else {
            logger('MESSAGE RULE', 'No Message Rules Found');
            mrCbk(null, null)
        }
    },
    namedRule: function (nrCbk) {
        logger('NAMED RULE', 'Uploading Named Rules');

        var nrFlag = true;

        if (NAMED_RULE.length > 0) {

            async.mapSeries(NAMED_RULE, function (rule, nCbk) {

                fs.readFile('./import/' + rule + '.json', function (err, data) {
                    if (err) {
                        logger('ERROR', err)
                        logger('NAMED RULE', 'Error in Named Rules upload!')
                        nCbk(err, null)
                    } else {
                        var str = data.toString();
                        var obj = JSON.parse(str);

                        updateNamedRule(obj.data, function (status, dat) {

                            if (!status) {
                                nrFlag = false;
                            }
                            nCbk(null, null)
                        })

                    }
                });
            }, function (rerr, rres) {

                if (nrFlag) {
                    logger('NAMED RULE', 'Named Rules uploaded successfully');
                } else {
                    logger('NAMED RULE', 'Error in Named Rules upload!')
                }

                nrCbk(null, null)
            })
        } else {
            logger('NAMED RULE', 'No Named Rules Found');
            nrCbk(null, null)
        }
    },
    binaryRule: function (bCbk) {
        logger('BINARY RULE', 'Uploading binary Rules');

        var brFlag = true;

        if (BINARY_RULE.length > 0) {

            async.mapSeries(BINARY_RULE, function (rule, nCbk) {

                fs.readFile('./import/' + rule + '.json', function (err, data) {
                    if (err) {
                        logger('ERROR', err)
                        logger('BINARY RULE', 'Error in Binary Rules upload!')
                        nCbk(err, null)
                    } else {
                        var str = data.toString();
                        var obj = JSON.parse(str);

                        updateBinaryRule(obj.data, function (status, dat) {
                            if (!status) {
                                brFlag = false;
                            }
                            nCbk(null, null)
                        })

                    }
                });
            }, function (rerr, rres) {
                if (brFlag) {
                    logger('BINARY RULE', 'Binary Rules uploaded successfully');
                } else {
                    logger('BINARY RULE', 'Error in Binary Rules upload!')
                }
                bCbk(null, null)
            })
        } else {
            logger('BINARY RULE', 'No binary Rules Found');
            bCbk(null, null)
        }
    },
    jobRule: function (jCbk) {
        logger('JOB RULE', 'Uploading Job Rules');

        var jrFlag = true;

        if (JOB_RULE.length > 0) {

            async.mapSeries(JOB_RULE, function (rule, nCbk) {

                fs.readFile('./import/' + rule + '.json', function (err, data) {
                    if (err) {
                        BUILD_STATUS = false;
                        logger('ERROR', err)
                        logger('JOB RULE', 'Error in Job Rules upload!')
                        nCbk(err, null)
                    } else {
                        var str = data.toString();
                        var obj = JSON.parse(str);

                        obj.data.domainKey = DOMAIN_KEY;

                        updateJobRule(obj.data, function (status, dat) {
                            if (!status) {
                                jrFlag = false;
                            }
                            nCbk(null, null)
                        })

                    }
                });
            }, function (rerr, rres) {
                if (jrFlag) {
                    logger('JOB RULE', 'Job Rules uploaded successfully');
                } else {
                    logger('JOB RULE', 'Error in Job Rules upload!')
                }
                jCbk(null, null)
            })
        } else {
            logger('JOB RULE', 'No Job Rules Found');
            jCbk(null, null)
        }
    },
}, function (err, result) {

    if (!BUILD_STATUS) {
        logger('ERROR', 'Process Ended with error!')
        console.log("******************* ERROR OCCURRED ***************************")
    } else {
        logger('BUILD', 'Process Ended!')
        console.log("******************* BUILD SUCCESS ***************************")
    }
});


function logger(module, msg) {
    console.log(new Date() + ' | [' + module + '] ', msg)
}

//Platform API's

function insertMessages(data, cbk) {

    request.post({
        uri: API_URL + '/mspec/upsert/' + API_TOKEN,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                var result = JSON.parse(res.body);
                if (result.code == 'SUCCESS') {
                    cbk(true, null)
                } else {
                    BUILD_STATUS = false;
                    logger('ERROR', result)
                    cbk(false, result)
                }
            } else {
                BUILD_STATUS = false;
                logger('ERROR', res.body)
                cbk(false, JSON.parse(res.body))
            }
        } else {
            BUILD_STATUS = false;
            logger('ERROR', err)
            cbk(false, null)
        }

    });
}

function insertRecords(data, cbk) {

    request.post({
        uri: API_URL + '/storage/spec/upsert/' + API_TOKEN,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                var result = JSON.parse(res.body);
                if (result.code == 'SUCCESS') {
                    cbk(true, null)
                } else {
                    BUILD_STATUS = false;
                    logger('ERROR', result)
                    cbk(false, result)
                }
            } else {
                BUILD_STATUS = false;
                logger('ERROR', res.body)
                cbk(false, JSON.parse(res.body))
            }
        } else {
            BUILD_STATUS = false;
            logger('ERROR', err)
            cbk(false, null)
        }

    });
}

function updateMessageRule(data, cbk) {

    request.post({
        uri: API_URL + '/rules/upsert/' + API_TOKEN,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                var result = JSON.parse(res.body);
                if (result.code == 'SUCCESS') {
                    cbk(true, null)
                } else {
                    BUILD_STATUS = false;
                    logger('ERROR', result)
                    cbk(false, result)
                }
            } else {
                BUILD_STATUS = false;
                logger('ERROR', res.body)
                cbk(false, JSON.parse(res.body))
            }
        } else {
            BUILD_STATUS = false;
            logger('ERROR', err)
            cbk(false, null)
        }

    });
}

function updateBinaryRule(data, cbk) {

    request.post({
        uri: API_URL + '/brules/upsert/' + API_TOKEN,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                var result = JSON.parse(res.body);
                if (result.code == 'SUCCESS') {
                    cbk(true, null)
                } else {
                    BUILD_STATUS = false;
                    logger('ERROR', result)
                    cbk(false, result)
                }
            } else {
                BUILD_STATUS = false;
                logger('ERROR', res.body)
                cbk(false, JSON.parse(res.body))
            }
        } else {
            BUILD_STATUS = false;
            logger('ERROR', err)
            cbk(false, null)
        }

    });
}

function updateNamedRule(data, cbk) {

    request.post({
        uri: API_URL + '/nrules/upsert/' + API_TOKEN,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                var result = JSON.parse(res.body);
                if (result.code == 'SUCCESS') {
                    cbk(true, null)
                } else {
                    BUILD_STATUS = false;
                    logger('ERROR', result)
                    cbk(false, result)
                }
            } else {
                BUILD_STATUS = false;
                logger('ERROR', res.body)
                cbk(false, JSON.parse(res.body))
            }
        } else {
            BUILD_STATUS = false;
            logger('ERROR', err)
            cbk(false, null)
        }

    });
}

function updateJobRule(data, cbk) {

    request.post({
        uri: API_URL + '/jobs/upsert/' + API_TOKEN,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
    }, function (err, res, body) {

        if (!err) {

            if (res.statusCode === 200) {
                var result = JSON.parse(res.body);
                if (result.code == 'SUCCESS') {
                    cbk(true, null)
                } else {
                    BUILD_STATUS = false;
                    logger('ERROR', result)
                    cbk(false, result)
                }
            } else {
                BUILD_STATUS = false;
                logger('ERROR', res.body)
                cbk(false, JSON.parse(res.body))
            }
        } else {
            BUILD_STATUS = false;
            logger('ERROR', err)
            cbk(false, null)
        }

    });
}
