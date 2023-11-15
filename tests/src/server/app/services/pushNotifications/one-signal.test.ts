import {
	GatherRecipientsResult,
	IncidentNotifier,
} from "../../../../../../server/src/app/services/push-notifications/incident-notifier";

import { OneSignal } from "../../../../../../server/src/app/services/push-notifications/one-signal"
import { dd } from "../../../../../../server/src/utils";
const conf = require('../../../../../../server/src/config/get').fetch()
const models = require("../../../../../../server/src/app/models");
const Sequelize = models.Sequelize
const crypto = require("crypto");
const randomString = (): string => {
	return crypto.randomBytes(16).toString("hex");
};

const USERS = 40;

describe(`OneSignal class`, () => {
	test(`is mocked when unit tests are running`, async () => {
    let user = await models.User.findAll()
    const USER_ID = user[0].id
    const api: OneSignal = new OneSignal()
    expect(api.getMock()).toBe(true)
	})
});
