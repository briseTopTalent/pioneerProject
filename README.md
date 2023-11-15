# firewire-web-application
The WebApplication is located on the src folder
The API and database interaction is located on the server folder 

# Start the WebApp locally
 - Run `yarn install` to install dependencies
 - Run `npm run make` to build all Typescript files
 - Set `PIONEER_ENV_FILE` environment variable to point to your .env file
  - Use `sample.env` as a basis for your `.env`
 - Run `yarn dev`to start Application locally on development
 - Run `yarn build` to build the Application for prouction
 - RUn `yarn start` to start the Application for production

# Run unit tests
- First, make sure you have a `.env.test`. There is no other way to set environment variables for unit tests. It should also be in the same directory as this README
- Next, run: `npx jest`, or run `npm run test`

# Environment variables
## `MOCK_ONE_SIGNAL`
If this environment variable exists, it will cause the One Signal SDK to not hit the actual production URL. It doesn't matter if this env var is set to something truthy or falsey, if it exists it means it won't hit prod
## One Signal vars
These are mandatory if you want to call the One Signal API
```
ONE_SIGNAL_API_KEY=
ONE_SIGNAL_APP_ID=
```

## DB credentials are mandatory
```
DB_USER=postgres
DB_PASS=your-pw
DB_NAME=firewire_db
DB_HOST=0.0.0.0
DB_SSL=false
```

## Self-explanatory envs
```
NPM_USE_PRODUCTION=false
NODE_ENV=production
legacy=https://nycfirewire.herokuapp.com/api/v1/incident
S3_BUCKET_NAME=nycfirewire-staging
S3_ACCESSKEY=access-key-here
AWS_SECRET_ACCESS_KEY=secret-here
```


# Migrations
- look at `server/src/database/migrations.sql` if the table you need isn't created

# Deploying to Staging
The URL is currenty: https://fireweb.ddns.net/

First, ssh into the droplet as root
Next, run `/root/bin/run-deployment`
- This script will call `/home/nodex/bin/run-deployment` which will pull down `main` and build the app
- once the app is done building, it restarts the supervisor daemon
- The code can then be found at `/home/nodex/temp/`

# Deploying to prod
- There is currently no prod environment on Digital Ocean.
- A prod environment exists on Heroku. That is not something we directly push to

# Databases
- Currently, the db credentials point to a staging db
- TODO: host the staging DB on digital ocean

# New incidents
There are three systems that come into play when a new Incident is created:
- Incident notifier (app/services/push-notifications/incident-notifier.ts)
- One Signal API (app/services/push-notifications/one-signal.ts)
- Queue Worker (app/services/push-notifications/queue-worker.ts)

- First, the queue worker is started when the app boots up.
- Then, anytime the create incident api endpoint gets hit, it creates rows in `push_notifications`. These rows represent which users and which incidents to send.
- The queue worker checks the `push_notifications` table every 10 seconds. If it finds rows in the table that haven't been claimed (`claimed_by` column), it claims them by updating the rows with it's instance id.
- Once rows have been claimed, they are immediately processed, and if there are `push_id`'s on the users found in `push_notifications`, it will make calls to the One Signal API endpoint.

## New Incidents - Logs
The `push_notifications_queue_log` table is used to log the status/information of each queue worker job. This should ideally only be used initially to debug and catch issues with the system. It should be noted that this entire system is thoroughly unit tested, so the logging mechanism is more for auditing.


# Facebook CLI commands
It's possible to call the facebook graph API to generate an app access token:

First, you must make sure the `cli.ts` file is compiled. to do this, just run `./cli.sh` which will ONLY build the `cli.ts` file. 

Once that's compiled, run:
```sh
node ./server/src/cli.js \
   --fb-gen-page-token \
   --fb-user-id=USER_ID_HERE \
   --fb-access-token='YOUR_ACCESS_TOKEN_HERE'
```

The output will be json.

# User CLI commands
It's possible to generate a password hash:
```sh
node ./server/src/cli.js \
    --generate-pw \
    --password="this-is-my-password"

```

Output has been redacted, but the resulting string will be what you would set the specified user's password to be.

## Update User password
```sh
node ./server/src/cli.js \
    --user-id=42 \
    --update-pw \
    --password="this-is-my-password"
```

## Send Password Reset Email
```sh
node server/src/cli.js \
    --send-reset-email \
    --email=EEEE
```
OR by `--user-id`
```sh
node server/src/cli.js \
    --send-reset-email \
    --user-id=N
```
