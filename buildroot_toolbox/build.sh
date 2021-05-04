#!/usr/bin/env bash

docker build -t digitaltwin .

docker run \
    --rm \
    --name build_dt \
    -v $PWD/dist:/build \
    -v $PWD/config/:/config \
    digitaltwin

echo "The output ISO is copied to ./dist folder"
