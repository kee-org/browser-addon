echo "Signing debug build..." &&
gulp sign &&
cat .signedKeeXPI &&
cat .unsignedKeeXPI &&
cat .downloadLinkKeeXPI &&
cat ../browser-addon-updates/beta/update.json &&
faauv --update ../browser-addon-updates/beta/update.json --update-link $(cat .downloadLinkKeeXPI) dist/$(cat .unsignedKeeXPI) &&
cat ../browser-addon-updates/beta/update.json &&
cd ../browser-addon-updates &&
git add . &&
git commit -m "Automatic release of new beta version" &&
git status &&
git log &&
cd -
