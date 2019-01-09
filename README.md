# AutoDeployer

## Install

`npm install`

## Configure

Edit "settings/config.json" file, there you can change the port in which the service listens to requests, the secret it uses, and the directories where there's a repo to pull.

It is not recommended to set a different secret than the one generated, for security reasons. You can do that if you want, but it could be predicted with dictionaries.

If no "config.json" file is found, or if it gets corrupted, run the script with the "--reconfigure" parameter.

## Running it

Run it with a user that has permissions in all folders, in order for the pulls to succeed.

## Post-Commit commands

Do you need to run a post-commit command? Like cleaning cache or restarting a service? Create a script called `postinstall.sh` (UNIX) or `postinstall.cmd` (Windows) with the needed commands. This program will run it for you.

## How to invoke it

Make a GET request like this:

http://example.com:3000/deploy?key=SECRET

## Contributions

If you want to contribute or have any suggestion/report, please make a pull request or open an issue.

## FAQ:

### Is it safe to make deploys automatically with this?

Depends. Do you just need to run `git pull` and a couple commands? Then yes. Do you need to recompile the whole kernel and do system-critical stuff? It can, but it's up to you.

## Does it work with Google Code, Mercurial or Subversion?

Nope. If you do use such systems, please consider upgrade them to git.

## Does it work with *insert git provider here*?

Yes it does! This only runs `git pull` on the directories you specify on its settings.

### Why is the log filled with favicon requests?

Why do you try to acces this service from a web browser?

### But I'm not!

Then someone else is. Try to add a firewall in front of the service.