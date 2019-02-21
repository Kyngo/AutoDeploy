# AutoDeployer

Simple, easy deployment of software from a Git repo.

## Requirements 📦

* Node.JS 8 or newer
* Tested on GNU/Linux and macOS

## Install 👨🏻‍💻

Just clone this repository and run `npm install`, `yarn` or install the node modules with the package manager of your choice.

## Configure 🛠

Edit the `settings/config.json` file, where you can change the port in which the service listens to requests, the secret it uses, and the directories where there's a repo to pull.

It is not recommended to set a different secret than the one generated, for security reasons. You can do that if you want, but it could be predicted with dictionaries.

If no `config.json` file is found, or if it gets corrupted, run the script with the `--reconfigure` parameter.

## Configure on your Git provider

Make a Webhook pointing to your AutoDeploy URL (e.g. http://example.com:3000/deploy?key=SECRET). When you make a push, a request will be triggered to the service.

## Running it 💨

Run it with a user that has permissions in all folders, in order for the pulls to succeed.

## Post-Commit commands 💾

Do you need to run a post-commit command? Like cleaning cache or restarting a service? Create a script called `postinstall.sh` (UNIX) or `postinstall.cmd` (Windows) with the needed commands. This program will run it for you.

## How to invoke it 🛰

Make a GET request like this:

http://example.com:3000/deploy?key=SECRET

## Contributions ✅

If you want to contribute or have any suggestion/report, please make a pull request or open an issue. Donations are welcome!

![Donate on PayPal](https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg)

[Donate on PayPal](https://paypal.me/kyngonet)

## FAQ 🤔

### Is it safe to make deploys automatically with this?

Depends. Do you just need to run `git pull` and a couple commands? Then yes. Do you need to recompile the whole kernel and do system-critical stuff? It can, but it's up to you.

### Does it work with Google Code, Mercurial or Subversion?

Nope. If you do use such systems, please consider upgrade them to git.

### Does it work with *insert git provider here*?

Yes it does! This only runs `git pull` on the directories you specify on its settings.

### Why is the log filled with favicon requests?

This happens when the request to the auto-deploy server is done though a web browser (typing the URL and entering it, not making any sort of XHR). It can be prevented with a firewall or any sort of source IP whitelist.