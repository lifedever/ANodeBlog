#!/bin/sh
pm2 stop processes.json && git pull && npm install && pm2 start processes.json
exit 0
