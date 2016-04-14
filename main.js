//Modules to include and shit
var meta = require("./package.json"),
    config = require("./config"),
    http = require('http'),
    DiscordClient = require('discord.io'),
    random = require("random-js")(), // uses the nativeMath engine
    fs = require("fs"),
    steam = require("@doctormckay/steam-webapi"),
    api = new steam(config.steamKey);

var bot = new DiscordClient({
    token: config.token,
    autorun: true
});

const mysql = require("mysql");
//database
var con = mysql.createConnection({
    host: process.env.OPENSHIFT_MYSQL_DB_HOST,
    port: process.env.OPENSHIFT_MYSQL_DB_PORT,
    user: process.env.OPENSHIFT_MYSQL_DB_USERNAME,
    password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
    database: "discord"
});

con.on('error', function(err) {
    if (!err.fatal) {
        return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {


        console.log('Re-connecting lost connection: ' + err.stack);

        con = mysql.createConnection({
            host: process.env.OPENSHIFT_MYSQL_DB_HOST,
            port: process.env.OPENSHIFT_MYSQL_DB_PORT,
            user: process.env.OPENSHIFT_MYSQL_DB_USERNAME,
            password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
            database: "discord"
        });
        con.connect();
    }
});

//Global Variables
var cmds = {};
var connected = bot.connected
var stressTest = false;
var prevConnection = false;
var g_plugins = [];

function handleRequest(req, res) {
    res.end('UberBot is Online.');
    console.log("HTTP RESPONSE");
    var url = req.url
    if (url == '/health') {
        res.writeHead(200);
        res.end();
    } else if (url.indexOf('/info/') == 0) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.end(JSON.stringify(sysInfo[url.slice(6)]()));
    } else {
        fs.readFile('./static' + url, function(err, data) {
            if (err) {
                res.writeHead(404);
                res.end();
            } else {
                var ext = path.extname(url).slice(1);
                res.setHeader('Content-Type', contentTypes[ext]);
                if (ext === 'html') {
                    res.setHeader('Cache-Control', 'no-cache, no-store');
                }
                res.end(data);
            }
        });
    }
}

var server = http.createServer(handleRequest);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

server.listen(server_port, server_ip_address, function() {
    console.log("Listening on " + server_ip_address + ", server_port " + server_port);
});

server.on("error", () => {
    server = http.createServer(handleRequest);
    server.listen(server_port, server_ip_address, function() {
        console.log("Listening on " + server_ip_address + ", server_port " + server_port);
    });
});

function statusReport(report) {
    console.log(report);
    bot.sendMessage({
        to: "129321709533790208",
        message: report
    });
}


bot.on('ready', function() {
    var d = new Date();
    statusReport("New Session of UberBot Initialized. Session ID: " + random.integer(100000, 199999));
    statusReport("ALERT: UberBot is Online as of " + d.toDateString() + " " + d.toTimeString());
    statusReport("INFO: Logged in as " + bot.username + " with UID " + bot.id);
    statusReport("Running Node.js version " + process.version);
    statusReport('Running Uberbot version ' + meta.version);
    //console.log(bot.servers[bot.serverFromChannel("149707514521321473")].roles);
    if (prevConnection) {
        return;
    }

    fs.readdir(__dirname + "/commands", function(err, files) {
        if (err) {
            console.log("Error loading commands: " + err);
            return;
        }

        files.forEach((file) => {
            if (file.match(/\.js$/)) {
                try {
                    var gcmds = require(__dirname + "/commands/" + file)(statusReport, g_plugins);
                    gcmds.triggers.forEach(function(trigger) {
                        cmds[trigger] = gcmds;
                    });
                } catch (e1) {
                    try {
                        statusReport(`Unable to load command ${gcmds.meta.name} due to the following error: ${e1}`)
                    } catch (e2) {
                        statusReport(`Unable to load command at ${file} due to the following document format error: ${e1} which resulted in ${e2}`);
                    }
                    return;
                }
                statusReport(`Loaded command ${gcmds.meta.name}`);
            }
        });
    });

    fs.readdir(__dirname + "/plugins", function(err, files) {
        if (err) {
            console.log("Error loading plugins: " + err);
            return;
        }
        files.forEach((file) => {
            if (file.match(/\.js$/)) {
                try {
                    var gplugins = require(__dirname + "/plugins/" + file)(statusReport);
                    if (gplugins.disabled) {
                        console.log(`Haulting load on ${gplugins.name} ${gplugins.version} by ${gplugins.author} due to disable flag being enabled.`);
                        g_plugins.push(`${gplugins.name} ${gplugins.version} by ${gplugins.author} **DISABLED**`);
                        return;
                    }
                    gplugins.callback();
                } catch (e1) {
                    try {
                        console.log(`Unable to load ${gplugins.name} ${gplugins.version} by ${gplugins.author} due to the following error: ${e1}`);
                        g_plugins.push(`${gplugins.name} ${gplugins.version} by ${gplugins.author}  **NOT LOADED, ERROR**`);
                    } catch (e2) {
                        console.log(`Unable to load plugin at ${file} due to the following document format error: ${e1} which resulted in ${e2}`);
                        g_plugins.push(`${file} X.X.X by Unknown **NOT LOADED, BAD FORMAT**`);
                    }
                    return;
                }
                statusReport(`Loaded plugin ${gplugins.name} ${gplugins.version} by ${gplugins.author}`);
                g_plugins.push(`${gplugins.name} ${gplugins.version} by ${gplugins.author}  **LOADED, RUNNING**`);
            }
        });
    });
    prevConnection = true;
});

bot.on("disconnected", () => {
    var tries = 1;
    var repeat = setInterval(reconnect, 10000);

    function reconnect() {
        if (connected) {
            clearInterval(repeat);
            console.log(`INFO: Successfully reconnected after ${tries} retries.`);
            return;
        }
        console.log(`ERROR: Unable to connect. Retrying in 10 seconds... (×${tries})`);
        bot.connect();
        tries++;
    }
});

bot.on('message', function(user, userID, channelID, message, rawEvent) {
    var server = bot.serverFromChannel(channelID);
    var msplit = message.trim().slice(1).toLowerCase().split(" ");
    if (!cmds[msplit[0]]) {
        return;
    }
    if (userID == bot.id) {
        return;
    }
    if (message.slice(0, 1) != "&") {
        return;
    }
    try {
        cmds[msplit[0]].callback(channelID, user, userID, message, msplit);
    } catch (e) {
        statusReport(`Error with command ${cmds[msplit[0]].meta.name}: ${e}`);
        return;
    }
    statusReport(`Successfully ran ${cmds[msplit[0]].meta.name} from ${user} (${userID})`);
});


//exports
exports.bot = bot;
exports.commands = cmds;
exports.mysql = con;
exports.api = api;
exports.meta = meta;
exports.plugin = g_plugins;