#!/bin/bash

ssh olanmccarthy@leela.netsoc.co cd yugioh_drafting || exit; git pull; node app.js
