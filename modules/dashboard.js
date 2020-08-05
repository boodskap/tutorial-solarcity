var Boodskap = require("./boodskap");
var Tables = require("./tables");
var Utils = require('./utils');
var Dashboard = function (app) {

    this.app = app;
    this.utils = new Utils(app)
    this.table = new Tables(app);
};

module.exports = Dashboard;

Dashboard.prototype.performActions = function (req, res) {

    const self = this;

    var action = req['params']['action'];

    if (action === 'status') {

        self.status(req, res);

    } else {
        res.status(401).json({ status: false, message: 'Unauthorized Access' })
    }
};

Dashboard.prototype.status = function (req, res) {
    const self = this;
    const boodskap = new Boodskap(self.app, req['session']['sessionObj'] ? req['session']['sessionObj']['boodskap'].token : null);
    boodskap.executeNamedRule(self.table.GET_DASHBOARD, req['body'], function (status, data) {
        if (status) {
            res.json({ status: true, data: data })
        } else {
            res.json({ status: false, data: data, message: "Failed to load" })
        }
    })
};