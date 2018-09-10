# Backend
## Environment
### Install node :
https://nodejs.org/en/download/

### Install typescript to compile sources
```
npm install -g typescript
```

### Install MongoDB
https://docs.mongodb.com/manual/installation/

### Install project's dependencies
```
npm install
```

### Install forever to start server as a service [optional]
```
npm install -g forever
```

## Compile server sources
```
tsc
```

## Run server 
### Make sure MongoDB is running as a service or start it on another prompt window
```
mongod
```

### Start server
```
node build/bootstrap.js
```

### Or with Forever
```
forever start build/bootstrap.js
```

### Or with Forever wirth live reload enabled
```
forever start build/bootstrap.js
```