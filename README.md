# Auto-Deployer

## Install

`npm install`

## Configure

Edit "config.json" file, there you can change the port in which the service listens to requests, the secret it uses, and the directories where there's a repo to pull.

It is not recommended to set a different secret than the one generated, for security reasons.

If no "config.json" file is found, or if it gets corrupted, run the script with the "--reconfigure" parameter.

## How to invoke it

Make a GET request like this:

http://example.com:3000/deploy?key=SECRET

## Contributions

If you want to contribute or have any suggestion/report, please make a pull request or open an issue.