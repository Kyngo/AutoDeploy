#!/bin/bash
# autodeploy daemon
# chkconfig: 345 20 80
# description: autodeploy daemon
# processname: autodeploy

DAEMON_PATH="/opt/AutoDeploy/"

DAEMON="node"
DAEMONOPTS="main.js"

NAME="AutoDeploy"
DESC="AutoDeploy service"
PIDFILE=/var/run/$NAME.pid
SCRIPTNAME=/etc/init.d/$NAME

case "$1" in
start)
	printf "%-50s" "starting $NAME..."
	cd $DAEMON_PATH
	PID=`$DAEMON $DAEMONOPTS > /var/log/autodeploy.log 2>&1 & echo $!`
	#echo "Guardando PID" $PID " en " $PIDFILE
        if [ -z $PID ]; then
            printf "%s\n" "failed"
        else
            echo $PID > $PIDFILE
            printf "%s\n" "started"
        fi
;;
status)
        printf "%-50s" "Checking $NAME..."
        if [ -f $PIDFILE ]; then
            PID=`cat $PIDFILE`
            if [ -z "`ps axf | grep ${PID} | grep -v grep`" ]; then
                printf "%s\n" "PID file exists, process doesn't"
            else
                echo "Working!"
            fi
        else
            printf "%s\n" "Service is stopped"
        fi
;;
stop)
        printf "%-50s" "Stopping $NAME"
            PID=`cat $PIDFILE`
            cd $DAEMON_PATH
        if [ -f $PIDFILE ]; then
            kill -HUP $PID
            printf "%s\n" "Stopped"
            rm -f $PIDFILE
        else
            printf "%s\n" "Could not find the PID file"
        fi
;;

restart)
  	$0 stop
  	$0 start
;;

*)
        echo "Usage: $0 {status|start|stop|restart}"
        exit 1
esac