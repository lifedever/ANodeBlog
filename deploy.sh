#!/bin/sh
forever stop bin/www && git pull && npm install && forever start bin/www
exit 0
