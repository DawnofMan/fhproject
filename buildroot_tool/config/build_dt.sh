#!/bin/sh
set -e

# Build our vm defconfig.
echo $PWD
make BR2_EXTERNAL=/buildroot_dt vm_defconfig \
    && make legal-info \
    && make
