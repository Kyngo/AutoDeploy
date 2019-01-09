/**
 * GIT DEPLOYER SCRIPT BY KYNGO
 * Copyright (c) 2018
 * https://kyngo.es
 * https://github.com/kyngo
 * https://bitbucket.org/kyngo
 */

// system libs
const fs = require("fs");
const { exec } = require('child_process');
// npm libs
const express = require("express");
const sha256 = require("sha256");
const moment = require("moment");
const argv = require('minimist')(process.argv.slice(2));
// own files
const postInstall = require("./postinstall");

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
    console.log("If you don't want this deployment system to auto-update, remove it from the directories array in the JSON file!")
}

const config = JSON.parse(fs.readFileSync("./config.json"));

// user checkup
if (process.platform === "win32") {
    console.log("Could not determine user, as we're running on Windows. Please run this as administrator!");
} else {
    if (process.getuid() === 0) {
        console.log("WARNING: Script run as root! This could be dangerous to the system!");
    } else {
        console.log("Deployment server is not run as root!\nCheck which user is running it and if it has permissions to pull!\nUID " + process.getuid());
    }
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
    if (config.directories.length > 0) {
        config.directories.forEach(idx => {
            runCommand("cd " + idx + " && git pull", idx)
            .then(commandResult => {
                results.push(commandResult);
                postInstall(idx);
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
    } else {
        res.status(418);
        res.json({error: "You can't run this without any repos configured!"})
    }
});

app.all("*", (req, res) => {
    res.status(404);
    res.json({result: "404 Not Found"});
})

// process execution function
const runCommand = (cmd, dir) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            console.log("Executed command: " + cmd);
            if (err) {
                reject(err);
            } else {
                resolve({dir: dir, stdout: stdout, stderr: stderr});
            }
        });
    })
}
