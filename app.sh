envApp=${1}
echo "envApp full path [ ${envApp}]"
cd /jenkins/home/workspace/${envApp}
echo "================================"
pwd
echo "================================"

envName=`echo $envApp | awk -F '-' '{print $1}'`

rm -rf node_modules dist
rm -rf operation-fed.tar.gz
yarn install
echo "execute npm run build"
yarn run build
cd dist
tar -czvf operation-fed.tar.gz *
