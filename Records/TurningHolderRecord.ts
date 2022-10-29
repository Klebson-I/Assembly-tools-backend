import {pool} from "../database";

interface TurningHolderRecordType {
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
    BMC: number;
    MIIDM: string;
    WT: number
    match_code: string;
    name: string;
    type: string;
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
    BMC: number;
    MIIDM: string;
    WT: number
    match_code: string;
    name: string;
    type: string;

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

    static async getAllByMatchingParams (param : string) {
        try {
            const [results]
                = await pool.execute('SELECT * from `turning_holder` where `match_code` = :param',{
                    param
            }) as [TurningHolderRecord[]];
            return results.map((turning_holder) => new TurningHolderRecord(turning_holder));
        }
        catch (e) {
            console.log('DB error')
        }
    }

};