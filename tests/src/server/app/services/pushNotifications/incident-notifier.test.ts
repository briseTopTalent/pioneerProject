import {
	GatherRecipientsResult,
	IncidentNotifier,
} from "../../../../../../server/src/app/services/push-notifications/incident-notifier";

import { dd } from "../../../../../../server/src/utils";
const models = require("../../../../../../server/src/app/models");
const Sequelize = models.Sequelize
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
}
beforeEach(async () => {
  await m_init()
})
afterEach(async () => {
  await m_init()
})

describe(`incident notifier class`, () => {
	test(`can recognize users that set their locality to a specific value`, async () => {
    let userRow = await models.User.findAll()
    const USER_ID = userRow[0].id
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
		let tally: number = 0;
		const PAGE_SIZE: number = 10;
		for (let i: number = 0; i < 4; i++) {
			let users: Array<ION.Notifications> = await inotifier.queueLocalityChunk(
				incident,
				i,
				PAGE_SIZE
			);
			tally += users.length;
			expect(users.length).toBe(PAGE_SIZE);
			for (const u of users) {
				expect(userIdList.indexOf(u._user) > -1).toBe(true);
			}
		}
		expect(tally).toBe(USERS);
		tally = 0;
    await models.User.destroy({
      where: {
        email: {
          [Sequelize.Op.like]: 'test_%',
        }
      }
    })
		await models.Incident.destroy({
			where: {
				id: incidentId,
			},
		});
		for (const noid of norecIdList) {
			await models.Notifications.destroy({
				where: {
					id: noid,
				},
			});
		}
	}, 120000);
	test(`a user doesnt get notified more than once`, async () => {
    let userRow = await models.User.findAll()
    const USER_ID = userRow[0].id
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
		/**
		 * Generate a fake incident
		 */
		let incidentId: number = 0;
		incident.locality = 1;
		incident.sub_locality = 2;
    incident.responding_units = [
      'Bn-10','Bn-11','Bn-12',
    ]
		let row = await models.Incident.create(incident);
		incidentId = row.id;
		let userIdList: Array<number> = [];
		let user = await models.User.create({
			email: `test_user_${randomString()}.toString('hex')}_${Date.now()}@test.com`,
			password: `asdf`,
			first_name: `Test`,
			last_name: `User`,
		});
		userIdList.push(user.id);
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
			notification = {
				_user: user_id,
				notification_type: "sub_locality",
				notification_id: "2",
			};
			notificationRecord = await models.Notifications.create(notification);
			norecIdList.push(notificationRecord.id);

      notification.notification_type = 'unit'
      notification.notification_id = 'Bn-11'
			notificationRecord = await models.Notifications.create(notification);
			norecIdList.push(notificationRecord.id);
		}
		let tally: number = 0;
		const PAGE_SIZE: number = 10;

    /**
     * Test for locality match
     */
		incident.locality = 1;
		let users: Array<ION.Notifications> = await inotifier.queueLocalityChunk(incident, 0, 10);
		expect(users.length).toBe(1);

    /**
     * Test for sub_locality match
     */
		incident.sub_locality = 2;
		users = await inotifier.queueSubLocalityChunk(incident, 0, 10);
		expect(users.length).toBe(1);

    /**
     * Test for unit match
     */
    incident.responding_units = ['Bn-10','Bn-11','Bn-12']
		users = await inotifier.queueUnitChunk(incident, 0, 10);
		expect(users.length).toBe(1);
		await models.Incident.destroy({
			where: {
				id: incidentId,
			},
		});
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
	test(`all notifications are handled via createRowsInPushNotificationsTable`, async () => {
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
    let result: number = await inotifier.createRowsInPushNotificationsTable(row)
    expect(result).toBe(userIdList.length)
		await models.Incident.destroy({
			where: {
				id: incidentId,
			},
		});
		for (const noid of norecIdList) {
			await models.Notifications.destroy({
				where: {
					id: noid,
				},
			});
		}
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
    await models.User.destroy({
      where: {
        email: {
          [Sequelize.Op.like]: 'test_%',
        }
      }
    })
	}, 120000);
});
