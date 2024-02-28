#!/bin/bash

source ~/.nvm/nvm.sh
npm install
npm run build
npm run dev -- --host
