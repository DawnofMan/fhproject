#!/bin/sh
set -e

# Build Digital Twin VM defconfig.
echo $PWD
make BR2_EXTERNAL=/config vm_defconfig \
    && make legal-info \
    && make
