## Overview
Crawl google trends daily -> Save on MongoDb -> Notify to telegram channel

## Installation
```js
npm install pm2 -g
pm2 ecosystem
```

## Config enviroment variables
Local: config in file `.env`<br/>
Deployed using PM2: config in `ecosystem.config.js`<br/>
```js
TELEGRAM_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx
```

## Database MongoDB
You can edit in file `app\db\MongoConfig.js` or setting in environment variables<br/>

## File ecosystem.config.js
```js
module.exports = {
	apps: [
		{
			name: "google-trends",
			script: "..\\deploy\\google-trends\\launcher.js",
			watch: true,
			env: {
				NODE_ENV: "development",
				TELEGRAM_TOKEN: "xxx",
				TELEGRAM_CHAT_ID: yyy
			},
			env_production: {
				NODE_ENV: "production",
				TELEGRAM_TOKEN: "xxx",
				TELEGRAM_CHAT_ID: yyy
			},
			instances: 1,
			exec_mode: "fork"
		}
	]
}
```

## Build
```js
npm run-script compile   				# Like command `node script/compile.js` Output is `dist` directory
npm run-script compile-ob				# Obfuscation file js into jsc by using `bytecode` package
```

## Run by Node
```js
node dist/launcher.js   				# Source in `dist` directory
```

## Run by PM2
```js
pm2 start ecosystem.config.js --env=production`
```

## Run on startup
Reference file `script\task-scheduler-window10.md`