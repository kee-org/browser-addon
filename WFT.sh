KEE_VERSION_MANIFEST=`sed -nE 's/^.*"version": "([0-9]{1,}\.[0-9]{1,})\.[0-9x]{1,}"\,/\1/p' manifest.json`
KEE_VERSION_TAG=`git describe --abbrev=0 --tags | sed -E 's/^([0-9]{1,}\.[0-9]{1,})\.([0-9]{1,})$/\1 \2/g'`
echo "${KEE_VERSION_MANIFEST} ${KEE_VERSION_TAG}" | awk '{printf($1==$2?""$2"."$3+1:""$1".0")}' | xargs -I {} git tag -a {} -m "{}"
