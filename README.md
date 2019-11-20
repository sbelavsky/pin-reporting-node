# Pin Reporting lambda function
## Prerequisities
- install [nodejs](https://nodejs.org/)

## How to deploy into the AWS sandbox
```
npm install
cd oraclelib-layer
../node_modules/.bin/sls deploy
cd ..
node_modules/.bin/sls deploy
```

## Local debug
For local development put `oraclelib-layer/lib` into your system path and run from the project root
```
npm run debug
```
This will run emulated API Gateway and AWS Lambda locally with a `8080` debug port