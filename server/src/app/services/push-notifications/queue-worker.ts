const models = require('../../models');
const sequelize = models.Sequelize;
const crypto = require('crypto');
import { dd } from '../../../utils';
import { OneSignal, SendResult, } from './one-signal'

export interface WorkStatus {
  error: boolean;
  message: string;
  status: string;
  batchGroup: Array<BatchGroup>;
  sent: number;
}

export interface AcquiredRows {
  records: Array<ION.PushNotifications>;
  count: number;
  error: boolean;
  message: string;
}
export interface BatchGroup {
  userIdList: Array<number>;
  message: string;
}

export class QueueWorker {
  model: typeof models.PushNotifications;
  instanceId: string;
  constructor() {
    this.model = models.PushNotifications;
    this.instanceId = crypto.randomUUID();
  }
  getInstanceId() : string {
    return this.instanceId
  }
  async grabRecords(count: number): Promise<AcquiredRows> {
    try {
      let rows: Array<ION.PushNotifications> =
        await models.PushNotifications.findAll({
          attributes: ['id','incident_id','_user',],
          where: {
            claimed_by: {
              [sequelize.Op.eq]: null,
            },
          },
          limit: count,
        });
      let idList: Array<number> = [];
      for (const record of rows) {
        if (typeof record.id === 'undefined') {
          continue;
        }
        idList.push(record.id);
      }
      await models.PushNotifications.update(
        {
          claimed_by: this.instanceId,
        },
        {
          where: {
            id: {
              [sequelize.Op.in]: idList,
            },
          },
        }
      );
      return {
        records: rows,
        error: false,
        message: 'ok',
        count: rows !== null ? rows.length : 0,
      };
    } catch (e) {
      let msg: string = 'error';
      if (e instanceof Error) {
        msg = e.message;
      }
      if (typeof e === 'string') {
        msg = e;
      }
      return {
        records: [],
        error: true,
        message: msg,
        count: 0,
      };
    }
  }
  async getNycLocalityId() : Promise<number> {
    const rows = await models.Locality.findAll({
      where: {
        name: 'New York City',
      },
    })
    return rows[0].id
  }
  async getLocalityStrings(incident: ION.Incident) : Promise<[string,string]> {
    let arr : [string,string] = ['','']
    let loc : ION.Locality  = await models.Locality.findOne({
      where: {
        id: incident.locality,
      },
    })
    arr = [loc.name,'']
    if(typeof incident.sub_locality !== 'undefined' && incident.sub_locality !== null) {
      let sub : ION.SubLocality  = await models.SubLocality.findOne({
        where: {
          id: incident.sub_locality,
        },
      })
      arr = [loc.name,sub.name]
    }
    return arr
  }
  async generateIncidentMessage(incident: ION.Incident) : Promise<string> {
    /**
     * <Sublocality Name> *<Incident Type/field_1_value>*
     * <Formatted field 3 value> -  <Address>
     * <field_2_value/subtitle>
     *
     * For the formatted field 3 value... if the locality is New York City, put "Box " in front of the value...otherwise, just put the value
     */
    let str : string = ''
    let locStrings : [string,string] = await this.getLocalityStrings(incident)
    if(locStrings[1].length){
      str = locStrings[1] + ' *'
    }else{
      str = '*'
    }
    str += String(incident.field1_value).toUpperCase() + '*' + "\n"
    const nycLocalityID:number = await this.getNycLocalityId()
    if(String(incident.field3_value) !== 'null'){
      if(nycLocalityID === incident.locality){
        str += 'Box ' + incident.field3_value + ' - ';
      }else{
        str += incident.field3_value + ' - ';
      }
    }
    str += incident.address + "\n"
    if(String(incident.field2_value) !== 'null'){
      str += String(incident.field2_value).toUpperCase();
    }
    return str
  }

  async work(rowCount: number): Promise<WorkStatus> {
    let batchGroup : Array<BatchGroup> = []
    let status: WorkStatus = {
      error: false,
      message: '',
      status: 'started',
      batchGroup,
      sent: 0,
    };
    let acquiredRows: AcquiredRows = await this.grabRecords(rowCount)
    if(acquiredRows.error){
      return {
        error: true,
        message: `couldn't aqcuire rows: "${acquiredRows.message}"`,
        status: 'acquire-rows-failure',
        batchGroup,
        sent: 0,
      }
    }
    status.error = false
    status.message = 'started'
    let batch: { [index: number]: Array<number>} = {}
    let incidentIdList: Array<number> = []
    for(const row of acquiredRows.records) {
      if(incidentIdList.indexOf(row.incident_id) === -1){
        incidentIdList.push(row.incident_id)
      }
      if(typeof batch[row.incident_id] === 'undefined') {
        batch[row.incident_id] = []
      }
    }
    for(const row of acquiredRows.records) {
      batch[row.incident_id].push(row._user)
    }
    for(const key in batch){
      let incident: ION.Incident = await models.Incident.findOne({
        where: {
          id: key,
        },
      })
      batchGroup.push({
        message: await this.generateIncidentMessage(incident),
        userIdList: batch[key],
      })
    }
    const oneSignalSDK : OneSignal = new OneSignal()
    let sent: number = 0
    for(const batch of batchGroup){
      let resp: SendResult = await oneSignalSDK.send(batch.userIdList,batch.message).catch((error) => {
        return error
      })
      if(resp.error) {
        console.error(`oneSignalSDK.send() failed with: "${JSON.stringify(resp,null,2)}"`)
      }else{
        console.debug(`oneSignalSDK.send() ok: "${JSON.stringify(resp,null,2)}"`)
        ++sent
      }
    }
    for(const row of acquiredRows.records) {
      await models.PushNotifications.update({
        sent_at: new Date(),
      },{
        where: {
          id: row.id,
        },
      })
    }
    await models.PushNotifications.destroy({
      where: {
        sent_at: {
          [sequelize.Op.ne]: null,
        },
      },
    });
    status.message = 'processed'
    status.sent = sent
    return status;
  }
}
