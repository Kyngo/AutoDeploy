/**
 * GIT DEPLOYER SCRIPT BY KYNGO
 * Copyright (c) 2018
 * https://kyngo.es
 * https://github.com/kyngo
 */

// system libs
const fs = require("fs");
const { exec } = require('child_process');
// npm libs
const express = require("express");
const sha256 = require("sha256");
const moment = require("moment");
const argv = require('minimist')(process.argv.slice(2));

// configurations logic
if (!fs.existsSync("./config.json") || argv.hasOwnProperty("reconfigure")) {
    console.log("Generating configuration file...");
    const config = {
        port: 3000,
        secret: sha256(moment().format("YYYY-MM-DDTHH:mm:SSZ")),
        directories: [__dirname]
    }
    fs.writeFileSync("config.json", JSON.stringify(config, null, 4));
    console.log("\nSucessfully saved configuration file! New secret is: \n" + config.secret + "\nDO NOT SHARE WITH ANYONE!\n");
}

const config = JSON.parse(fs.readFileSync("./config.json"));

// user checkup
if (process.getuid() === 0) {
    console.log("WARNING: Script run as root! This could be dangerous to the system!");
} else {
    console.log("Deployment server is not run as root!\nCheck which user is running it and if it has permissions to pull!\nUID " + process.getuid());
}

// web server logic
const app = express();
app.listen(config.port,() => console.log("Server is listening on port " + config.port + "!") );

// watchdog - verifier
app.all("*", (req, res, next) => {
    let isAuthorized = false;
    if (!req.query.key || req.query.key != config.secret) {
        res.status(401);
        res.json({error: "unauthorized"})
    } else {
        isAuthorized = true;
        next();
    }
    console.log(req.method + " " + req.path + " - " + req.ip + " - " + (isAuthorized ? "Authorized" : "Kicked"));
});

// deploy function
app.get("/deploy", (req, res) => {
    let results = [];
    config.directories.forEach(idx => {
        runCommand("cd " + idx + " && git pull")
        .then(commandResult => {
            results.push(commandResult);
            if (fs.existsSync(idx + "/postinstall.sh")) {
                runCommand("cd " + idx + " && chmod +x postinstall.sh && ./postinstall.sh")
                .then(secondCommandResult => console.log("Post-Install script says:\n" + JSON.stringify(secondCommandResult, null, 4)))
                .catch(secondCommandCrash => console.error("Post-Install script crashed saying:\n" + secondCommandCrash));
            }
            if (results.length === config.directories.length) {
                res.json(results);
            }   
        }).catch(commandCrash => {
            results.push("ERR:" + commandCrash);
            if (results.length === config.directories.length) {
                res.json(results);
            }
        })
    })
});

app.all("*", (req, res) => {
    res.send("404 Not Found");
})

// process execution function
const runCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            console.log("Executed command: " + cmd);
            if (err) {
                reject(err);
            } else {
                resolve({stdout: stdout, stderr: stderr});
            }
        });
    })
}
