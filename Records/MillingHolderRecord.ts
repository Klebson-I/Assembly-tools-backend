import {pool} from "../database";

export type MillingHolderType = 'DISC_CUTTER_HOLDER' | 'END_MILL_HOLDER';

export interface MillingHolderRecordType {
    id: string;
    KAPR: number|null;
    DC: number|null;
    CDXBFW: number|null;
    CICTTOT: number|null;
    MTP: string|null;
    CUTINTMASTER: string|null;
    ZEFP: number|null;
    ADINTMS: string|null;
    HAND: string|null;
    CNSC:string|null;
    DPC: string|null;
    CP: string|null;
    DRVCT: number|null;
    DCON: number|null;
    DHUB:number|null;
    THUB: number|null;
    LF: number|null;
    RPMX: number|null;
    LB1: number|null;
    APMX:number|null;
    CCC:number|null;
    AERMXPFW:number|null;
    RMPXFFW: number|null;
    AZ: number|null;
    CPDF:number|null;
    GAMF:number|null;
    GAMP: number|null;
    BD1: number|null;
    TQ: number|null;
    BMC: string|null;
    WT: number|null;
    name: string|null;
    type: string;
    IS: number|null;
};

export type MillingHolderPropertyType = Record<number|string|null, keyof MillingHolderRecordType>;

export class MillingHolderRecord{
    millingHolder: MillingHolderPropertyType = {};

    constructor(obj: MillingHolderRecordType) {
        const entries = Object.entries(obj);
        for (let [entryName, value] of entries) {
            this.millingHolder[entryName] = value;
        }
    };

    static async getOne (id: string) : Promise<MillingHolderPropertyType|null>{
        try {
            const [results]
                = await pool.execute('SELECT * from `milling_holder` where `id`=:id',{
                id
            }) as [MillingHolderRecordType[]];
            const item = results.map((holder) => new MillingHolderRecord(holder));
            return item.length > 0 ? item[0].millingHolder : null;
        }
        catch (e) {
            console.log('DB error');
        }
    };

    static async getAll () : Promise<MillingHolderPropertyType[]> {
        try {
            const [results]
                = await pool.execute('SELECT * from `milling_holder`') as [MillingHolderRecordType[]];
            return results.map((holder) => (new MillingHolderRecord(holder).millingHolder));
        }
        catch (e) {
            console.log(e);
        }
    };

    static async getAllByType (type: MillingHolderType) : Promise<MillingHolderPropertyType[]> {
        try {
            const [results]
                = await pool.execute('SELECT * from `milling_holder` where `type`=:type',{
                    type,
            }) as [MillingHolderRecordType[]];
            return results.map((holder) => new MillingHolderRecord(holder).millingHolder);
        }
        catch (e) {
            console.log('DB error');
        }
    };
};

