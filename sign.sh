echo "Signing debug build..." &&
gulp sign &&
cat .signedKeeXPI &&
cat .unsignedKeeXPI &&
unsignedKeeXPI=`cat .unsignedKeeXPI` &&
echo $unsignedKeeXPI &&
cat ../browser-addon-updates/beta/update.json &&
faauv --update ../browser-addon-updates/beta/update.json `cat .unsignedKeeXPI` &&
cat ../browser-addon-updates/beta/update.json &&
cd .. &&
git add . &&
git commit -m "Automatic release of new beta version" &&
git status &&
cd -
