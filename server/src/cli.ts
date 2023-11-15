const CURRENT_DIR: string = __dirname;

const models = require(CURRENT_DIR + '/app/models/index');
import { OneSignal } from './app/services/push-notifications/one-signal';
import {
  Facebook,
  FacebookPage,
} from './app/services/push-notifications/facebook';
import { Twitter } from './app/services/push-notifications/twitter';
const NodeChildProcess = require('child_process');
const bcrypt = require('bcryptjs');
const SocialMedia = require('./app/services/push-notifications/social-media');

async function handle_user(args: Array<string>): Promise<number> {
  let verbose: boolean = false;
  let generate_pw: string = '';
  let mode: string = '';
  let match: any = null;
  let user_id: number | null = null;
  let user_email: string | null = null;
  for (const arg of args) {
    if (arg.match(/^--verbose/)) {
      verbose = true;
      continue;
    }
    if (arg.match(/^--send-reset-email$/)) {
      mode = 'send-reset-email';
      continue;
    }
    if (arg.match(/^--update-pw$/)) {
      mode = 'update-pw';
      continue;
    }
    match = arg.match(/^--email=(.*)$/);
    if (match) {
      user_email = match[1];
      continue;
    }
    if (arg.match(/^--generate-pw$/)) {
      mode = 'generate-pw';
      continue;
    }
    match = arg.match(/^--password=(.*)$/);
    if (match) {
      generate_pw = match[1];
      continue;
    }
    match = arg.match(/^--user-id=(.*)$/);
    if (match) {
      if (isNaN(parseInt(match[1], 10))) {
        console.error(
          `You must specify a valid user id of *ONLY* numbers. Instead, we got: "${match[1]}"`
        );
        return -1;
      }
      user_id = parseInt(match[1], 10);
    }
  }
  if (mode === 'send-reset-email') {
    if (user_id === null && user_email === null) {
      console.error(`You must specify a valid --user-id=N or --email=EE@CCC`);
      return -1;
    }
    let user: any = null;
    if (user_id) {
      user = await models.User.findOne({
        where: {
          id: user_id,
        },
        raw: true,
      });
    } else {
      user = await models.User.findOne({
        where: {
          email: String(user_email).toLowerCase(),
        },
        raw: true,
      });
    }
    if (!user) {
      console.error(`Couldn't find a user with that ID. Exiting...`);
      return -1;
    }
    user_id = user.id;
    user_email = user.email;
    console.info(`Found user: [${user_id}](${user_email})...`);
    const forgotPw: any = require('./app/services/user/forgotPw');
    let resp: any = await forgotPw(user_email, true); // true = force
    console.log(resp);
    return 0;
  }
  if (mode === 'update-pw') {
    if (generate_pw.length === 0) {
      console.error('You must specify an password with: --password=NNN');
      return -1;
    }
    if (user_id === null) {
      console.error('You must specify a user-id with: --user-id=N');
      return -1;
    }
    console.info('Looking up user in database...');
    let user: any = await models.User.findOne({
      where: {
        id: user_id,
      },
      raw: true,
    });
    if (!user) {
      console.error(`Couldn't find a user with that ID. Exiting...`);
      return -1;
    }
    console.info(`Found user by ID: [${user_id}](${user.email})...`);
    console.info(`Updating...`);
    await models.User.update(
      {
        password: bcrypt.hashSync(generate_pw, 8),
      },
      {
        where: {
          id: user_id,
        },
      }
    );
    console.log('Done updating user password');
    return 0;
  }
  if (mode === 'generate-pw') {
    if (generate_pw.length === 0) {
      console.error('You must specify an password with: --password=NNN');
      return -1;
    }
    console.log(bcrypt.hashSync(generate_pw, 8));
    return 0;
  }
  return 0;
}

async function handle_one_signal(args: Array<string>): Promise<number> {
  let ONE_SIGNAL_APP_ID: string = '';
  let ONE_SIGNAL_API_KEY: string = '';
  for (const arg of args) {
    let matches = arg.match(/^--onesignal-app-id=(.*)$/);
    if (matches) {
      ONE_SIGNAL_APP_ID = matches[1];
    }
    matches = arg.match(/^--onesignal-api-key=(.*)$/);
    if (matches) {
      ONE_SIGNAL_API_KEY = matches[1];
    }
  }
  for (const arg of args) {
    let matches = arg.match(/^--test-onesignal=([0-9]{1,})$/);
    if (matches) {
      if (ONE_SIGNAL_API_KEY.length == 0) {
        console.error(`Missing API KEY. Pass in: --onesignal-api-key=XXX`);
        return -1;
      }
      if (ONE_SIGNAL_APP_ID.length == 0) {
        console.error(`Missing APP ID. Pass in: --onesignal-app-id=XXX`);
        return -1;
      }
      console.debug(`test onesignal user id: ${matches[1]}`);
      let lib: OneSignal = new OneSignal();
      lib.setConfiguration(
        ONE_SIGNAL_API_KEY,
        ONE_SIGNAL_APP_ID,
        'https://onesignal.com/api/v1/notifications',
        false
      );

      console.debug(
        await lib.send([parseInt(matches[1], 10)], 'This is a test')
      );
    }
  }
  return 0;
}
async function handle_twitter_post(args: Array<string>): Promise<number> {
  let verbose: boolean = false;
  let tweet: string = '';
  let mode: string = '';
  let match: any = null;
  let incidentId: number = -1;
  for (const arg of args) {
    if (arg.match(/^--verbose/)) {
      verbose = true;
      continue;
    }
    if (arg.match(/^--twitter-get-creds-for-incident/)) {
      mode = 'get-creds-for-incident';
      continue;
    }
    match = arg.match(/^--twitter-incident-id=(.*)$/);
    if (match) {
      incidentId = parseInt(match[1], 10);
      continue;
    }
    if (arg.match(/^--twitter-tweet/)) {
      mode = 'tweet';
      continue;
    }
    //match = arg.match(/^--tweet=(.*)$/);
    //if (match) {
    //  tweet = match[1];
    //  continue;
    //}
  }
  let lib = new Twitter();
  if (mode === 'tweet') {
    if (incidentId === -1 || isNaN(incidentId)) {
      console.error(`you must provide --twitter-incident-id=(.*)`);
      return -1;
    }
    console.log(`Sending tweet for incidentId: "${incidentId}"`);
    let response: any = await lib.makePost(incidentId);
    console.log(JSON.stringify(response, null, 2));
    return 0;
  }
  if (mode === 'get-creds-for-incident') {
    if (incidentId === -1 || isNaN(incidentId)) {
      console.error(`you must provide --twitter-incident-id=(.*)`);
      return -1;
    }
    console.log(`Getting credentials for incident id: "${incidentId}"`);
    let r: any = await lib.getCredentialsForIncident(incidentId);
    console.log(r);
    console.log('------------------------------------------------------');
    return 0;
  }

  return 0;
}
async function handle_facebook(args: Array<string>): Promise<number> {
  let verbose: boolean = false;
  let mode: string = '';
  let userId: string = '';
  let accessToken: string = '';
  let match: any = '';
  let locality: string = '';
  let content: string = '';
  let page_name: string = '';
  let pageId: string = '';
  let argsLocalityID: string = '';
  for (const arg of args) {
    if (arg.match(/^--verbose/)) {
      verbose = true;
      continue;
    }
    if (arg.match(/^--fb-post/)) {
      mode = 'post';
      continue;
    }
    if (arg.match(/^--fb-dump-available/)) {
      mode = 'dump-available';
      continue;
    }
    if (arg.match(/^--fb-dump$/)) {
      const row: any = await models.Facebook.findAll({ raw: true });
      console.log(JSON.stringify(row, null, 2));
      return 0;
    }
    match = arg.match(/^--fb-content=(.*)$/);
    if (match) {
      content = match[1];
      continue;
    }
    match = arg.match(/^--fb-page-id=(.*)$/);
    if (match) {
      pageId = match[1];
      continue;
    }
    match = arg.match(/^--fb-locality-id=(.*)$/);
    if (match) {
      argsLocalityID = match[1];
      continue;
    }
    if (arg.match(/^--fb-locality-expired/)) {
      mode = 'check-locality-expired';
      continue;
    }
    if (arg.match(/^--fb-gen-app-token/)) {
      mode = 'generate-app-token';
      continue;
    }
    if (arg.match(/^--fb-gen-page-token/)) {
      mode = 'generate-page-token';
      continue;
    }
    match = arg.match(/^--fb-user-id=(.*)$/);
    if (match) {
      userId = match[1];
      continue;
    }
    match = arg.match(/^--fb-access-token=(.*)$/);
    if (match) {
      accessToken = match[1];
      continue;
    }
    match = arg.match(/^--fb-locality=(.*)$/);
    if (match) {
      locality = match[1];
      continue;
    }
  }

  if (mode === 'generate-page-token' && userId && accessToken) {
    userId = userId.replace(/[^0-9a-z_-]+/gi, '');
    accessToken = accessToken.replace(/[^a-z.0-9_\-+]+/gi, '');
    if (verbose) {
      console.log('generate page token');
    }
    const url: string = `https://graph.facebook.com/${userId}/accounts?access_token=${accessToken}`;
    if (verbose) {
      console.debug({ url });
    }
    let r: any = await fetch(url)
      .then(async (res: any) => {
        if (verbose) {
          console.log(res.status);
          console.log('json', await res.json());
        }
        return await res.json();
      })
      .then(async (jsonResponse: any) => {
        return await jsonResponse;
      })
      .catch((err: any) => {
        console.error(`error: `, err);
        return null;
      });
    console.log(JSON.stringify(r.data, null, 2));
    return 0;
  }
  if (mode === 'check-locality-expired') {
    let lib = new Facebook();
    let int_locality_id: number | typeof NaN = parseInt(locality, 10);
    if (isNaN(int_locality_id)) {
      console.error(`Invalid locality id. must be a valid integer. Exiting...`);
      return -1;
    }
    let is_expired: boolean = await lib.is_locality_expired(int_locality_id);
    console.log(
      `Locality ${locality} ${is_expired ? 'IS' : '_is NOT_'} expired`
    );
    return 0;
  }
  if (mode === 'post') {
    let lib = new Facebook();
    let incident: Array<ION.Incident> = await models.Incident.findAll({
      where: {
        locality: parseInt(argsLocalityID, 10),
      },
      raw: true,
    });
    if (incident.length === 0) {
      console.error(
        `couldnt find incidents with that locality id of:"${argsLocalityID}"`
      );
      return -1;
    }
    let r: Array<[string, string]> = await lib.post_to_page(
      pageId,
      incident[0]
    );
    for (const line of r) {
      console.log(r[0], r[1]);
    }
    return 0;
  }
  if (mode === 'dump-available') {
    let lib = new Facebook();
    let localityId: number = parseInt(argsLocalityID, 10);
    let r: Array<FacebookPage> = await lib.available_and_active_pages(
      localityId
    );
    for (const row of r) {
      console.log(row);
      console.log('----------------------------------------------------------');
    }
    return 0;
  }
  return 0;
}
(async () => {
  const args: Array<string> = process.argv.splice(2);
  let n: number = 0;
  for (const func of [
    handle_one_signal,
    handle_twitter_post,
    handle_facebook,
    handle_user,
  ]) {
    n = await func(args);
    if (n < 0) {
      return process.exit(1);
    }
  }
  process.exit(0);
})();
