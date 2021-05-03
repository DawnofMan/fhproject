#!/usr/bin/env bash

docker build -t buildroot .

docker run \
    --rm \
    --name build_dt \
    -v $PWD/dist:/build \
    -v $PWD/buildroot_dt/:/buildroot_dt \
    -ti \
    --entrypoint "bash" \
    buildroot

echo "The output ISO is copied to ./dist folder"