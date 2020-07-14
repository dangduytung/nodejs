### Nodejs + Vercel
Tutorial deploy nodejs app to vercel (Now)

### Installation
```
node -v && npm -v           # Check node and npm
npm i -g now                # Install (Vercel) Now CLI
now -v
mkdir now-express
npm init -y
npm i --save express
npm i --save body-parser
npm i --save nodemon
```

### Setup
```
Edit scripts in package.json : "start": "node index.js"
```

### Run local
```
npm run start
```

### Deploy using Now
* Create now.json in root folder
* Command line to deploy
```
now
```