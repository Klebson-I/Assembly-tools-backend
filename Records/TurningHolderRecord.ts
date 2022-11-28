import {pool} from "../database";

export interface TurningHolderRecordType {
    id: string;
    KAPR1: number;
    KAPR2: number;
    PSIR: number;
    MTP: string;
    CUTINTMASTER: string;
    ADINTMS: string;
    RMPX: number;
    DMIN1: number;
    BAWS: number;
    BAMS: number;
    OHN: number;
    OHX: number;
    HAND: string;
    DPC: string;
    CP: string;
    LOCAP: string;
    DCON: string;
    LF: number;
    WF: number;
    HF: number;
    BD: number;
    GAMO: number;
    LAMS: number;
    TQ: number;
    BMC: string;
    MIIDM: string;
    WT: number
    match_code: string;
    name: string;
    type: string;
    IS: number;
};

export class TurningHolderRecord {
    id: string;
    KAPR1: number;
    KAPR2: number;
    PSIR: number;
    MTP: string;
    CUTINTMASTER: string;
    ADINTMS: string;
    RMPX: number;
    DMIN1: number;
    BAWS: number;
    BAMS: number;
    OHN: number;
    OHX: number;
    HAND: string;
    DPC: string;
    CP: string;
    LOCAP: string;
    DCON: string;
    LF: number;
    WF: number;
    HF: number;
    BD: number;
    GAMO: number;
    LAMS: number;
    TQ: number;
    BMC: string;
    MIIDM: string;
    WT: number
    match_code: string;
    name: string;
    type: string;
    IS: number;

    constructor (TurningHolderRecordObject: TurningHolderRecordType) {
        this.id = TurningHolderRecordObject.id;
        this.KAPR1 = TurningHolderRecordObject.KAPR1;
        this.KAPR2 = TurningHolderRecordObject.KAPR2;
        this.PSIR = TurningHolderRecordObject.PSIR;
        this.MTP = TurningHolderRecordObject.MTP;
        this.CUTINTMASTER = TurningHolderRecordObject.CUTINTMASTER;
        this.ADINTMS = TurningHolderRecordObject.ADINTMS;
        this.RMPX = TurningHolderRecordObject.RMPX;
        this.DMIN1 = TurningHolderRecordObject.DMIN1;
        this.BAWS = TurningHolderRecordObject.BAWS;
        this.BAMS = TurningHolderRecordObject.BAMS;
        this.OHN = TurningHolderRecordObject.OHN;
        this.OHX = TurningHolderRecordObject.OHX;
        this.HAND = TurningHolderRecordObject.HAND;
        this.DPC = TurningHolderRecordObject.DPC;
        this.CP = TurningHolderRecordObject.CP;
        this.LOCAP = TurningHolderRecordObject.LOCAP;
        this.DCON = TurningHolderRecordObject.DCON;
        this.LF = TurningHolderRecordObject.LF;
        this.WF = TurningHolderRecordObject.WF;
        this.HF = TurningHolderRecordObject.HF;
        this.BD = TurningHolderRecordObject.BD;
        this.GAMO = TurningHolderRecordObject.GAMO;
        this.LAMS = TurningHolderRecordObject.LAMS;
        this.TQ = TurningHolderRecordObject.TQ;
        this.BMC = TurningHolderRecordObject.BMC;
        this.MIIDM = TurningHolderRecordObject.MIIDM;
        this.WT = TurningHolderRecordObject.WT
        this.match_code = TurningHolderRecordObject.match_code;
        this.name = TurningHolderRecordObject.name;
        this.type = TurningHolderRecordObject.type;
        this.IS = TurningHolderRecordObject.IS;
    }

    static async getAll () {
        try {
            const [results]
                = await pool.execute('SELECT * from `turning_holder`') as [TurningHolderRecord[]];
            return results.map((turning_holder) => new TurningHolderRecord(turning_holder));
        }
        catch (e) {
            console.log('DB error')
        }
    }

    static async getOne (id: string) : Promise<TurningHolderRecord> {
        try {
            const [results]
                = await pool.execute('SELECT * from `turning_holder` where `id`=:id',{
                id
            }) as [TurningHolderRecord[]];
            const item = results.map((cutting_insert) => new TurningHolderRecord(cutting_insert));
            return item.length > 0 ? item[0] : null;
        }
        catch (e) {
            console.log('DB error');
        }
    }

    static async getAllByInsertShapeAndSize (shape: string, size: string) {
        try {
            const [results]
                = await pool.execute('SELECT `turning_holder`.`MTP`, `turning_holder`.`id`, `turning_holder`.`KAPR1`, `turning_holder`.`KAPR2`,`turning_holder`.`PSIR`,`turning_holder`.`CUTINTMASTER`,\n' +
                '`turning_holder`.`ADINTMS`, `turning_holder`.`RMPX`, `turning_holder`.`DMIN1`, `turning_holder`.`BAWS`, `turning_holder`.`BAMS`, `turning_holder`.`OHN`, `turning_holder`.`OHX`,\n' +
                '`turning_holder`.`HAND`, `turning_holder`.`DPC`, `turning_holder`.`CP`, `turning_holder`.`LOCAP`, `turning_holder`.`DCON`, `turning_holder`.`LF`, `turning_holder`.`WF`,\n' +
                '`turning_holder`.`HF`, `turning_holder`.`BD`, `turning_holder`.`GAMO`,\n' +
                '`turning_holder`.`LAMS`, `turning_holder`.`TQ`, `turning_holder`.`BMC`, `turning_holder`.`MIIDM`, `turning_holder`.`WT`, `turning_holder`.`name`,\n' +
                '`turning_holder`.`MTP`, `turning_holder`.`IS`, `turning_holder`.`type` FROM `turning_holder`\n' +
                'INNER JOIN `cutting_insert` ON `cutting_insert`.`SC` = `turning_holder`.`MTP` AND `cutting_insert`.`IS` = `turning_holder`.`IS`\n' +
                'WHERE `MTP`=:shape AND  `turning_holder`.`IS`=:size',{
                    shape,
                    size
            }) as [TurningHolderRecord[]];
            return results.map((turning_holder) => new TurningHolderRecord(turning_holder));
        }
        catch (e) {
            console.log('DB error')
        }
    }

};