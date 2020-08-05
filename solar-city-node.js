/*******************************
 * Import Required Modules
 ******************************/
var express = require('express');
var bodyParser = require('body-parser');
var layout = require('express-layout');
var path = require("path");
var app = express();
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var compression = require('compression');
var cors = require('cors');
const log4js = require('log4js');
var logConfig = require('./log4js.json');

const logger = log4js.getLogger('SOLAR-CITY');


/*******************************
 * API Access
 ****************************/
app.use(cors())

/*******************************
 * Require Configuration
 ****************************/
var conf = {};

try {
    conf = require(process.env.HOME + '/config/solar-city-config');
    console.log(new Date() + ' | Application Configuration Loaded From Config');
} catch (e) {
    console.log(new Date() + ' | Default Configuration Loaded');
    conf = require('./conf');
}
if(conf.settings.logger) {
    logConfig['appenders']['boodskap'] = {};

    logConfig['appenders']['boodskap'] = conf.settings.logger;
    logConfig['appenders']['boodskap']['url'] = conf.settings.boodskap.apiUrl;
    logConfig['appenders']['boodskap']['type'] = "boodskap-log4js-appender";
    logConfig['appenders']['boodskap']['logType'] = "";
    logConfig['appenders']['boodskap']['logChannel'] = "NODE";

    logConfig['categories']['default']['appenders'].push("boodskap")
}

log4js.configure(logConfig);

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


// compress all responses
app.use(compression())


//For Static Files
app.set('views', path.join(__dirname, 'views/dist/ng-flat-able'));
app.use('/', express.static(path.join(__dirname, 'views/dist/ng-flat-able')));
app.get('*',(req,res) =>{
    res.sendFile(path.join(__dirname,'views/dist/ng-flat-able/index.html'));
});
// var options = {
//     maxAge: '1d',
//     setHeaders: function (res, path, stat) {
//         res.set('vary', 'Accept-Encoding');
//         res.set('x-timestamp', Date.now());
//     }
// };

// app.use('/css', express.static(__dirname + '/webapps/css', options));
// app.use('/images', express.static(__dirname + '/webapps/images', options));
// app.use('/plugins', express.static(__dirname + '/webapps/plugins', options));
// app.use('/fonts', express.static(__dirname + '/webapps/fonts', options));


// var controllerOptions = {
//     maxAge: 0,
//     setHeaders: function (res, path, stat) {
//         res.set('vary', 'Accept-Encoding');
//         res.set('x-timestamp', Date.now());
//     }
// };

// app.use('/js', express.static(__dirname + '/webapps/js', controllerOptions));
// app.use(express.static(__dirname + '/webapps', controllerOptions));


app.use(layout());

app.use(cookieParser('ee357664-9cfb-482b-9a89-08a55f7fc074'));

var sessionObj = {
    secret: 'ee357664-9cfb-482b-9a89-08a55f7fc074',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 5 * 60 * 60 * 1000 //5 hours
    }
}

if (process.env.NODE_ENV === 'PROD') {
    app.set('trust proxy', 1) // trust first proxy
    sessionObj.cookie.secure = true // serve secure cookies
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(expressSession(sessionObj))


//For Template Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("view options", { layout: "index.html" });


app.conf = conf;
app.logger = logger;


var server = require('http').Server(app);

const fileupload = require('express-fileupload');
app.use(fileupload())

logger.info('gatekeeper Application Server Node Listening on ' + conf['web']['port']);

server.listen(conf['web']['port']);


//Initializing the web routes
var Routes = require('./routes/http-routes');
new Routes(app);


process
    .on('uncaughtException', function (err) {
        // handle the error safely
        logger.error(err)
    })
    .on('unhandledRejection', (reason, p) => {
        logger.error(reason, 'Unhandled Rejection at Promise', p);
    })