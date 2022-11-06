import {pool} from "../database";

export interface CuttingInsertRecordType {
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
    IS: number;
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
    IS: number

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
        this.IS = CuttingInsertRecordObject.IS;
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

    static async getAllByHolderShapeAndSize (shape: string, size: string) {
        try {
            const [results]
                = await pool.execute('SELECT `cutting_insert`.`IS`, `cutting_insert`.`id`, `cutting_insert`.`CPTP`, `cutting_insert`.`IFS`, `cutting_insert`.`D1`,\n' +
                '`cutting_insert`.`CEDC`, `cutting_insert`.`IC`, `cutting_insert`.`SC`, `cutting_insert`.`CUTINTSIZESHAPE`, `cutting_insert`.`LE`, `cutting_insert`.`RE`,\n' +
                '`cutting_insert`.`WEP`, `cutting_insert`.`HAND`, `cutting_insert`.`GRADE`, `cutting_insert`.`SUBSTRATE`, `cutting_insert`.`COATING`, `cutting_insert`.`AN`,\n' +
                '`cutting_insert`.`S`, `cutting_insert`.`WT`, `cutting_insert`.`match_code`, `cutting_insert`.`name`, `cutting_insert`.`type`, `turning_holder`.`MTP`, `turning_holder`.`IS`\n' +
                'FROM `cutting_insert`\n' +
                'INNER JOIN `turning_holder` ON `cutting_insert`.`SC` = `turning_holder`.`MTP` AND `cutting_insert`.`IS` = `turning_holder`.`IS`\n' +
                'WHERE `MTP`=:shape AND  `cutting_insert`.`IS`=:size',{
                shape,
                size
            }) as [CuttingInsertRecord[]];
            return results.map((cutting_insert) => new CuttingInsertRecord(cutting_insert));
        }
        catch (e) {
            console.log('DB error')
        }
    }
}