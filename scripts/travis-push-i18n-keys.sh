#!/bin/sh -e

if [ "$TRAVIS_BRANCH" != "master" ]; then
  echo "Not pushing i18n keys, not on master branch"
  exit 0
fi

node ${TRAVIS_BUILD_DIR}/tools/transifex.js -p ${TX_PASS}
