import {
	GatherRecipientsResult,
	IncidentNotifier,
} from "../../../../../../server/src/app/services/push-notifications/incident-notifier";

import { QueueWorker, AcquiredRows, WorkStatus, } from "../../../../../../server/src/app/services/push-notifications/queue-worker";
import { dd } from "../../../../../../server/src/utils";
const conf = require("../../../../../../server/src/config/get").fetch();
const models = require("../../../../../../server/src/app/models");
const Sequelize = models.Sequelize;
const crypto = require("crypto");
const randomString = (): string => {
	return crypto.randomBytes(16).toString("hex");
};

const USERS = 40;
async function m_init(){
    await models.User.destroy({
      where: {
        email: {
          [Sequelize.Op.like]: 'test_%',
        },
      },
    })
	await models.Notifications.truncate();
  await models.Incident.truncate();
	await models.PushNotifications.truncate();
}
beforeEach(async () => {
  await m_init()
})
afterEach(async () => {
  await m_init()
})


describe(`queue worker class`, () => {
	test(`acquires rows in push_notifications table`, async () => {
    let user = await models.User.findAll()
    const USER_ID = user[0].id

		let inotifier: IncidentNotifier = new IncidentNotifier();
		let incident: ION.Incident = {
			//id: 1,
			locality: 1,
			sub_locality: 2,
			created_by: USER_ID,
			latitude: "1",
			longitude: "2",
			address: "1234 foobar street",
			field1_value: "All hands",
			field2_value: "",
			field3_value: "",
			field4_value: "",
			field5_value: "",
			responding_units: ["Bn-10", "Bn-11", "Bn-12"],
			featured: false,
			sfeatured_image_url: null,
		};
		/**
		 * Generate a fake incident
		 */
		let incidentId: number = 0;
		incident.locality = 1;
		incident.sub_locality = 2;
		let row = await models.Incident.create(incident);
		incidentId = row.id;
		let userIdList: Array<number> = [];
		let halfUsers: Array<number> = [];
		for (let i = 0; i < USERS; i++) {
			let user = await models.User.create({
				email: `test_user_${randomString()}_${Date.now()}@test.com`,
				password: `asdf`,
				first_name: `Test`,
				last_name: `User`,
			});
			userIdList.push(user.id);
			if (i > USERS / 2) {
				halfUsers.push(user.id);
			}
		}
		let norecIdList: Array<number> = [];
		for (const user_id of userIdList) {
			/**
			 * Generate locality notification for users
			 */
			let notification: ION.Notifications = {
				_user: user_id,
				notification_type: "locality",
				notification_id: "1",
			};
			let notificationRecord = await models.Notifications.create(notification);
			norecIdList.push(notificationRecord.id);
		}
		let result: number = await inotifier.createRowsInPushNotificationsTable(row);
		expect(result).toBe(userIdList.length);

		const worker: QueueWorker = new QueueWorker();
		let pushRows: Array<ION.PushNotifications> = await models.PushNotifications.findAll({
			attributes: ["id", "incident_id", "_user"],
			where: {
				claimed_by: {
					[Sequelize.Op.eq]: null,
				},
			},
		});
		expect(pushRows.length).toBe(result);
    let acquiredRows: AcquiredRows = await worker.grabRecords(result)
    expect(acquiredRows.error).toBe(false)
    expect(acquiredRows.count).toBe(result)
    acquiredRows = await worker.grabRecords(result)
    expect(acquiredRows.error).toBe(false)
    expect(acquiredRows.count).toBe(0)

		for (const user_id of userIdList) {
			await models.User.destroy({
				where: {
					id: user_id,
				},
			});
			await models.PushNotifications.destroy({
				where: {
					_user: user_id,
				},
			});
		}
		for (const noid of norecIdList) {
			await models.Notifications.destroy({
				where: {
					id: noid,
				},
			});
		}
    await models.User.destroy({
      where: {
        email: {
          [Sequelize.Op.like]: 'test_%',
        }
      }
    })
	}, 120000);
	test(`work() function batches incidents with their user ids`, async () => {
    let user = await models.User.findAll()
    const USER_ID = user[0].id
    await models.User.destroy({
      where: {
        email: {
          [Sequelize.Op.like]: 'test_%',
        },
      },
    })
		let inotifier: IncidentNotifier = new IncidentNotifier();
		let incident: ION.Incident = {
			//id: 1,
			locality: 1,
			sub_locality: 2,
			created_by: USER_ID,
			latitude: "1",
			longitude: "2",
			address: "1234 foobar street",
			field1_value: "All hands",
			field2_value: "",
			field3_value: "",
			field4_value: "",
			field5_value: "",
			responding_units: ["Bn-10", "Bn-11", "Bn-12"],
			featured: false,
			sfeatured_image_url: null,
		};
		await models.Notifications.truncate();
    await models.PushNotifications.truncate()
    await models.Incident.truncate()
		/**
		 * Generate a fake incident
		 */
		let incidentId: number = 0;
		incident.locality = 1;
		incident.sub_locality = 2;
		let row = await models.Incident.create(incident);
		incidentId = row.id;
		let userIdList: Array<number> = [];
		let halfUsers: Array<number> = [];
		for (let i = 0; i < USERS; i++) {
			let user = await models.User.create({
				email: `test_user_${randomString()}_${Date.now()}@test.com`,
				password: `asdf`,
				first_name: `Test`,
				last_name: `User`,
			});
			userIdList.push(user.id);
			if (i > USERS / 2) {
				halfUsers.push(user.id);
			}
		}
		let norecIdList: Array<number> = [];
		for (const user_id of userIdList) {
			/**
			 * Generate locality notification for users
			 */
			let notification: ION.Notifications = {
				_user: user_id,
				notification_type: "locality",
				notification_id: "1",
			};
			let notificationRecord = await models.Notifications.create(notification);
			norecIdList.push(notificationRecord.id);
		}
		let result: number = await inotifier.createRowsInPushNotificationsTable(row);
		expect(result).toBe(userIdList.length);

		const worker: QueueWorker = new QueueWorker();
		let pushRows: Array<ION.PushNotifications> = await models.PushNotifications.findAll({
			attributes: ["id", "incident_id", "_user"],
			where: {
				claimed_by: {
					[Sequelize.Op.eq]: null,
				},
			},
		});
		expect(pushRows.length).toBe(result);
    let status: WorkStatus = await worker.work(result)
    expect(status.error).toBe(false)
    expect(status.message).toBe('processed')
    expect(status.batchGroup.length).toBe(1)
    expect(status.batchGroup[0].userIdList.length).toBe(result)

    let sentRows : Array<ION.PushNotifications> = await models.PushNotifications.findAll({
      where: {
        sent_at: {
          [Sequelize.Op.ne]: null,
        },
      },
    })
    expect(sentRows.length).toBe(result)
		for (const user_id of userIdList) {
			await models.User.destroy({
				where: {
					id: user_id,
				},
			});
			await models.PushNotifications.destroy({
				where: {
					_user: user_id,
				},
			});
		}
		for (const noid of norecIdList) {
			await models.Notifications.destroy({
				where: {
					id: noid,
				},
			});
		}
    await models.User.destroy({
      where: {
        email: {
          [Sequelize.Op.like]: 'test_%',
        }
      }
    })
	}, 120000);
});
