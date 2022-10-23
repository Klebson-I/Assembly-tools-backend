import {pool} from "../database";

interface CuttingInsertRecordType {
    id: string;
    CPTP: string;
    IFS: number;
    D1: number;
    CUTINTSIZESHAPE: string;
    CEDC: number;
    IC: number;
    SC: string;
    LE: number;
    RE: number;
    WEP: string;
    HAND: string;
    GRADE: number;
    SUBSTRATE: string;
    COATING: string;
    S: number;
    AN: number;
    WT: number;
    match_code: string;
    name: string;
    type: string;
}


export class CuttingInsertRecord {
    id: string;
    CPTP: string;
    IFS: number;
    D1: number;
    CUTINTSIZESHAPE: string;
    CEDC: number;
    IC: number;
    SC: string;
    LE: number;
    RE: number;
    WEP: string;
    HAND: string;
    GRADE: number;
    SUBSTRATE: string;
    COATING: string;
    S: number;
    AN: number;
    WT: number;
    match_code: string;
    name: string;
    type: string;

    constructor (CuttingInsertRecordObject: CuttingInsertRecordType) {
        this.id = CuttingInsertRecordObject.id;
        this.CPTP = CuttingInsertRecordObject.CPTP;
        this.IFS = CuttingInsertRecordObject.IFS;
        this.D1 = CuttingInsertRecordObject. D1;
        this.CUTINTSIZESHAPE = CuttingInsertRecordObject.CUTINTSIZESHAPE;
        this.CEDC = CuttingInsertRecordObject.CEDC;
        this.IC = CuttingInsertRecordObject.IC;
        this.SC = CuttingInsertRecordObject.SC;
        this.LE = CuttingInsertRecordObject.LE;
        this.RE = CuttingInsertRecordObject.RE;
        this.WEP = CuttingInsertRecordObject.WEP;
        this.HAND = CuttingInsertRecordObject.HAND;
        this.GRADE = CuttingInsertRecordObject.GRADE;
        this.SUBSTRATE = CuttingInsertRecordObject.SUBSTRATE;
        this.COATING = CuttingInsertRecordObject.COATING;
        this.S = CuttingInsertRecordObject.S;
        this.AN = CuttingInsertRecordObject.AN;
        this.WT = CuttingInsertRecordObject.WT;
        this.match_code = CuttingInsertRecordObject.match_code;
        this.name = CuttingInsertRecordObject.name;
        this.type = CuttingInsertRecordObject.type;
    }

    static async getAll () {
        try {
            const [results]
                = await pool.execute('SELECT * from `cutting_insert`') as [CuttingInsertRecord[]];
            return results.map((cutting_insert) => new CuttingInsertRecord(cutting_insert));
        }
        catch (e) {
            console.log('DB error')
        }
    }
    static async getOne (id: string) : Promise<CuttingInsertRecord> {
        try {
            const [results]
                = await pool.execute('SELECT * from `cutting_insert` where `id`=:id',{
                    id
            }) as [CuttingInsertRecord[]];
            const item = results.map((cutting_insert) => new CuttingInsertRecord(cutting_insert));
            return item.length > 0 ? item[0] : null;
        }
        catch (e) {
            console.log('DB error')
        }
    }

    static async getAllByMatchingParams (param : string) {
        try {
            const [results]
                = await pool.execute('SELECT * from `cutting_insert` where `match_code` = :param',{
                param
            }) as [CuttingInsertRecord[]];
            return results.map((cutting_insert) => new CuttingInsertRecord(cutting_insert));
        }
        catch (e) {
            console.log('DB error')
        }
    }
}