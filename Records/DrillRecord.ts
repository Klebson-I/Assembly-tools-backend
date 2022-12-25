import {pool} from "../database";

export interface DrillRecordType {
    id: string;
    TMC1ISO: string;
    DC: number;
    TCHA: string;
    LU: number;
    ULDR: number;
    ADINTMS: string;
    TCDCON: string;
    GRADE: string;
    SUBSTRATE: string;
    COATING: string;
    BSG: string;
    CNSC: string;
    DCON: number;
    SIG: number;
    PL: number;
    OAL: number;
    LF: number;
    LCF: number;
    NORGMX: number;
    RPMX: number;
    CP: number|null;
    TCHAL: number|null;
    TCHAU: number|null;
    WT: number|null;
    name: string|null;
    type: string;
}

export type DrillPropertyType = Record<number|string|null, keyof DrillRecordType>;

export class DrillRecord {

    drill: DrillPropertyType = {};

    constructor(obj: DrillRecordType) {
        const entries = Object.entries(obj);
        for (let [entryName, value] of entries) {
            this.drill[entryName] = value;
        }
    };

    static async getOne (id: string) : Promise<DrillPropertyType|null>{
        try {
            const [results]
                = await pool.execute('SELECT * from `drill` where `id`=:id',{
                id
            }) as [DrillRecordType[]];
            const item = results.map((drill) => new DrillRecord(drill));
            return item.length > 0 ? item[0].drill : null;
        }
        catch (e) {
            throw new Error(e.message);
        }
    };

    static async getAll () : Promise<DrillPropertyType[]> {
        try {
            const [results]
                = await pool.execute('SELECT * from `drill`') as [DrillRecordType[]];
            return results.map((drill) => new DrillRecord(drill).drill);
        }
        catch (e) {
            throw new Error(e.message);
        }
    };
}