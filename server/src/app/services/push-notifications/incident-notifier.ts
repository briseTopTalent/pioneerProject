const models = require('../../models');
const sequelize = models.Sequelize;
import { dd } from '../../../utils'

export interface GatherRecipientsResult {
  error: boolean;
  message: string;
  code: number;
}

export class IncidentNotifier {
  incident: ION.Incident | null;
  notificationsModel: typeof models.Notifications;
  model: typeof models.Incident;
  constructor() {
    this.model = models.Incident;
    this.incident = null;
    this.notificationsModel = models.Notifications;
  }
  async queueLocalityChunk(
    incident: ION.Incident,
    page: number,
    pageSize: number
  ): Promise<Array<ION.Notifications>> {
    /**
     * Fetch anyone with matching locality
     */
    const localityUsers = await this.notificationsModel.findAll({
      attributes: ['_user'],
      col: '_user',
      distinct: true,
      where: {
        notification_type: 'locality',
        notification_id: String(incident.locality),
      },
      limit: pageSize,
      offset: page * pageSize,
    });
    return localityUsers;
  }
  async queueSubLocalityChunk(
    incident: ION.Incident,
    page: number,
    pageSize: number
  ): Promise<Array<ION.Notifications>> {
    /**
     * Fetch anyone with matching sub locality
     */
    return await this.notificationsModel.findAll({
      attributes: ['_user'],
      col: '_user',
      distinct: true,
      where: {
        notification_type: 'sub_locality',
        notification_id: String(incident.sub_locality),
      },
      limit: pageSize,
      offset: page * pageSize,
    });
  }
  async queueIncidentTypeChunk(
    incident: ION.Incident,
    page: number,
    pageSize: number
  ): Promise<Array<ION.Notifications>> {
    /**
     * Fetch anyone with matching incident type
     */
    return await this.notificationsModel.findAll({
      attributes: ['_user'],
      col: '_user',
      distinct: true,
      where: {
        notification_type: 'incident_type',
        notification_id: incident.field1_value,
      },
      limit: pageSize,
      offset: page * pageSize,
    });
  }
  async queueUnitChunk(
    incident: ION.Incident,
    page: number,
    pageSize: number
  ): Promise<Array<ION.Notifications>> {
    if (
      typeof incident.responding_units === 'undefined' ||
      incident.responding_units === null ||
      incident.responding_units.length === 0
    ) {
      return [];
    }
    /**
     * Fetch anyone with matching respoonding units
     */
    return await this.notificationsModel.findAll({
      attributes: ['_user'],
      col: '_user',
      distinct: true,
      where: {
        notification_type: 'unit',
        notification_id: {
          [sequelize.Op.in]: incident.responding_units,
        },
      },
      limit: pageSize,
      offset: page * pageSize,
    });
  }

  async createRows(
    incident: ION.Incident,
    notifications: Array<ION.Notifications>
  ): Promise<number> {
    if(typeof incident.id === 'undefined' || incident.id === null){
      console.error(`createRows expects incident.id to be set!`)
      return 0
    }
    let count: number = 0;
    for (const row of notifications) {
      let pushRecord: ION.PushNotifications = {
        _user: row._user,
        incident_id: incident.id,
        claimed_by: null,
      };
      delete pushRecord.id
      try {
        let insertedRow = await models.PushNotifications.create(pushRecord);
        ++count;
      }catch(e: any){
        if('message' in e){
          console.error(`PushNotifications.create failed with: "${e.message}"`);
        }
        if(typeof e === 'string'){
          console.error(`PushNotifications.create failed with: "${e}"`);
        }
        console.error(`PushNotifications.create failed: `,e);
        continue;
      }
    }
    return count;
  }
  async createRowsInPushNotificationsTable(
    incident: ION.Incident
  ): Promise<number> {
    console.log('here top')
    let count: number = 0;
    let page: number = 0;
    let notifications: Array<ION.Notifications> = [];
    do {
      notifications = await this.queueLocalityChunk(incident, page++, 250);
      count += await this.createRows(incident, notifications);
      console.debug('.')
    } while (notifications && notifications.length);
    page = 0;
    do {
      notifications = await this.queueSubLocalityChunk(incident, page++, 250);
      count += await this.createRows(incident, notifications);
      console.debug('@')
    } while (notifications && notifications.length);
    page = 0;
    do {
      notifications = await this.queueIncidentTypeChunk(incident, page++, 250);
      count += await this.createRows(incident, notifications);
    } while (notifications && notifications.length);
    page = 0;
    do {
      notifications = await this.queueUnitChunk(incident, page++, 250);
      count += await this.createRows(incident, notifications);
    } while (notifications && notifications.length);
    return count;
  }
}
