import {pool} from "../database";


export interface CuttingInsertMillRecordType {
    id: string;
    CTPT: string;
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
    W1: number;
    KRINS: number;
    APMX: number;
}

export type CuttingInsertMillProperty = Record<null|number|string, keyof CuttingInsertMillRecordType>;

export type CuttingInsertMillType = 'INSERT_FOR_MILL'|'INSERT_FOR_SLOT_CUT';

export class CuttingInsertMillRecord {
    cuttingInsertMill: CuttingInsertMillProperty = {};

    constructor(obj: CuttingInsertMillRecordType) {
        const entries = Object.entries(obj);
        for (let [entryName, value] of entries) {
            this.cuttingInsertMill[entryName] = value;
        }
    };

    static async getOne (id: string) : Promise<CuttingInsertMillProperty|null>{
        try {
            const [results]
                = await pool.execute('SELECT * from `cutting_insert_mill` where `id`=:id',{
                id
            }) as [CuttingInsertMillRecordType[]];
            const item = results.map((insert) => new CuttingInsertMillRecord(insert).cuttingInsertMill);
            return item.length > 0 ? item[0] : null;
        }
        catch (e) {
            console.log('DB error');
        }
    };

    static async getAll () : Promise<CuttingInsertMillProperty[]> {
        try {
            const [results]
                = await pool.execute('SELECT * from `cutting_insert_mill`') as [CuttingInsertMillRecordType[]];
            return results.map((insert) => (new CuttingInsertMillRecord(insert).cuttingInsertMill));
        }
        catch (e) {
            console.log(e);
        }
    };

    static async getAllByType (type: CuttingInsertMillType) : Promise<CuttingInsertMillProperty[]> {
        try {
            const [results]
                = await pool.execute('SELECT * from `cutting_insert_mill` where `type`=:type',{
                type,
            }) as [CuttingInsertMillRecordType[]];
            return results.map((insert) => new CuttingInsertMillRecord(insert).cuttingInsertMill);
        }
        catch (e) {
            console.log('DB error');
        }
    };
};