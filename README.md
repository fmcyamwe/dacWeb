# dacOdac (quasar-project)

DAC assignement

To locally run, please follow the instructions below and install dependencies using 'yarn' or 'npm'

For docker image (with a connection issue to the API unfortunately) the command:
  > docker compose up --build
  
**It should** be run after having the API containers up in order for the container to be registered on the same bridge network.


## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
