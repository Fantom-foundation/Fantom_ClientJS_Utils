#!/bin/bash
#
# This will clean up the source tree for a new clean build
#
set -e
DIR="$( cd "$( dirname "$( dirname "${BASH_SOURCE[0]}" )")" >/dev/null 2>&1 && pwd )"
rm -rf "${DIR:?}/lib"
rm -rf "${DIR:?}/example/lib"
