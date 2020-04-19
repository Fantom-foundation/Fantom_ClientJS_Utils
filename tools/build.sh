#!/bin/bash
#
# This will build the library for production
#
set -e
DIR="$( cd "$( dirname "$( dirname "${BASH_SOURCE[0]}" )")" >/dev/null 2>&1 && pwd )"
cd "${DIR:?}"

# do the building
babel --source-maps -d lib src
