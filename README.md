# apiGateway

export DD_API_KEY=e4c5581bfa626cbcec6551ea5fae6e57
export APPNAME=altego-fiuber-identity-service
heroku config:add DD_AGENT_MAJOR_VERSION=7
heroku labs:enable runtime-dyno-metadata -a $APPNAME 
heroku config:add DD_DYNO_HOST=true
heroku buildpacks:add --index 1 https://github.com/DataDog/heroku-buildpack-datadog.git
heroku config:add DD_API_KEY=$DD_API_KEY
git commit --allow-empty -m "Rebuild slug"
git push heroku main