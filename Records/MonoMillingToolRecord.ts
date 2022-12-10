import {pool} from "../database";
import {MillingHolderRecordType} from "./MillingHolderRecord";

export type MonoMillingType = 'END_MILL_MONO_HOLDER';

export interface MonoMillingToolObject {
    id: string;
    TMC1ISO: string;
    KAPR2: number;
    DC1: number;
    DCX: number;
    APMXPCF: number;
    APMXPCB: number;
    LU: number;
    ZEFP: number;
    ADINTMS: string;
    GRADE: number;
    SUBSTRATE: string;
    COATING: string;
    CNSC: string;
    DCON: number;
    LF: number;
    BD: number;
    DN:number;
    LB:number;
    RPMX:number;
    WT: number;
    name: string;
    type: string;
};

export type MonoMillPropertyType = Record<number|string,keyof MonoMillingToolObject>


export class MonoMillingToolRecord {
    monoMillTool: MonoMillPropertyType = {};

    constructor(obj: MonoMillingToolObject) {
        const entries = Object.entries(obj);
        for (let [entryName, value] of entries) {
            this.monoMillTool[`${entryName}`] = value;
        }
    }

    static async getOne (id: string) : Promise<MonoMillPropertyType|null>{
        try {
            const [results]
                = await pool.execute('SELECT * from `mono_mill_tool` where `id`=:id',{
                id
            }) as [MonoMillingToolObject[]];
            const item = results.map((mill) => new MonoMillingToolRecord(mill).monoMillTool);
            return item.length > 0 ? item[0] : null;
        }
        catch (e) {
            console.log('DB error');
        }
    };

    static async getAll () : Promise<MonoMillPropertyType[]>{
        try {
            const [results]
                = await pool.execute('SELECT * from `mono_mill_tool`') as [MonoMillingToolObject[]];
            return results.map((mill) => new MonoMillingToolRecord(mill).monoMillTool);
        }
        catch (e) {
            console.log('DB error');
        }
    };
};