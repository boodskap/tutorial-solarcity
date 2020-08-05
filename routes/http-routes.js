var xml = require('xml');
var _ = require('underscore');
var cors = require('cors');

var Utils = require('../modules/utils');
var Boodskap = require("../modules/boodskap");

var Dashboard = require('../modules/dashboard');

var Routes = function (app) {

    this.app = app;
    this.logger = app.logger;
    this.utils = new Utils(app);

    this.boodskap = new Boodskap(app);
    this.dashboard = new Dashboard(app);
    this.init();

};
module.exports = Routes;

Routes.prototype.init = function () {
    const self = this;
    var sessionCheck = function (req, res, next) {
        var sessionObj = req.session['sessionObj'];
        if (sessionObj && sessionObj.login) {
            self.users.auditlogs('Page View', req);
            next();
        } else {
            req.session['sessionObj'] = null;
            req.session['user_session'] = null;
            req.session['challenges'] = null;
            req.session['challengeId'] = null;
            res.render('index.html')
        }
    };

    var apiSessionCheck = function (req, res, next) {
        var sessionObj = req.session['sessionObj'];
        if (sessionObj && sessionObj.login) {
            self.users.auditlogs('API', req);
            next();
        } else {
            req.session['sessionObj'] = null;
            req.session['user_session'] = null;
            req.session['challenges'] = null;
            req.session['challengeId'] = null;
            res.status(417).json({ status: false });
        }
    };

    var loginSession = function (req, res, next) {
        var sessionObj = req.session['user_session'];
        if (sessionObj) {
            next();
        } else {
            res.status(401).json({ status: false, message: 'Unauthorized Access' })
        }
    };

    //Initial Route
 
    self.app.post('/login', function (req, res) {
        self.boodskap.startSession(req, res)
    });

    self.app.get('/logout', function (req, res) {
        const boodskap = new Boodskap(self.app, req['session'].sessionObj['boodskap'].token);
        boodskap.logout();
        res.clearCookie("loginTime");
        req.session['sessionObj'] = null;
        req.session['user_session'] = null;
        req.session['challenges'] = null;
        req.session['challengeId'] = null;
        res.render('index.html')
    });

    //------------- Authentication API END -----------

    self.app.post('/dashboard/:action', function (req, res) {
        self.dashboard.performActions(req, res);
    });

};


