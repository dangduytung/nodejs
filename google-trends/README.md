# Overview
The system retrieves data from Google Trends Daily, saves it on MongoDB, and sends notifications to a Telegram channel.

# Use PM2

## Installation
```js
npm install pm2 -g
pm2 ecosystem
```

## Config Enviroment Variables
* Local: Configure in file `.env`
* Deployed using PM2: Configure in `ecosystem.config.js`
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

## Run with Node
```js
node dist/launcher.js   				# Source in `dist` directory
```

## Run with PM2
```js
pm2 start ecosystem.config.js --env=production`
```

## Run on Startup
Refer to the file `script\task-scheduler-window10.md`


## PM2 Logging
`../.pm2/logs/[app-name]-out-[pm2-index].log`<br/>
`../.pm2/logs/[app-name]-error-[pm2-index].log`

## Monitoring
Visit `https://app.pm2.io`

# Use Docker
`Docker` can be used to build and run instead of using `PM2`.

## Build and Run
```bash
# Before building, change some environment variables in the `docker-compose.yml` file
docker compose build

# Run
docker compose up

# Stop and remove
docker compose down
```

## Monitoring
```bash
# Access MongoDB
docker ps         									# Find the container ID
docker exec -it <container_id_or_name> mongo		# Access the MongoDB shell
show databases

# Network
docker network ls
docker network inspect <network_id>
```