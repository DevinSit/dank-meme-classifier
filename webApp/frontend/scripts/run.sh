#!/bin/bash

if [ ${NODE_ENV} == "dev" ]; then
    echo "Running development build";
    npm start;
else
    echo "Running production build";
    npm run start:prod;
fi
