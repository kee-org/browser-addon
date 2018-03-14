#!/bin/bash
set -ev

echo "Cloning our beta update repo..."
cd ..
git clone https://github.com/kee-org/browser-addon-updates.git
cd -
mkdir dist/signed
echo "Signing debug build..."
gulp sign
echo "link:"
cat .downloadLinkKeeXPI
echo "XPI:"
cat .signedKeeXPI
faauv --update ../browser-addon-updates/beta/update.json --update-link $(cat .downloadLinkKeeXPI) dist/signed/$(cat .signedKeeXPI)
cat ../browser-addon-updates/beta/update.json
cd ../browser-addon-updates
git add .
git commit -m "Automatic release of new beta version"
cd -
