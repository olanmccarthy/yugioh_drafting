#!/bin/bash

echo Please enter a set name:
read setName

echo Enter number of players:
read playerCount

echo If you cannot remember the password please don\'t keep trying as you will be locked out of the server!
ssh olanmccarthy@leela.netsoc.co && cd yugioh_drafting && git pull && node app.js $setName $playerCount
