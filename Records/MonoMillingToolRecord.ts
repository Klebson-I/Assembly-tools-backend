import {pool} from "../database";

export interface MonoMillingToolObject {
    id: string;
    TMC1ISO: string;
    DC: number;
    DCF: number;
    RE: number;
    APMX: number;
    CCC: string;
    LU: number;
    RMPXFFW: number;
    ZEFP: number;
    TCDCON: number;
    ADINTMS: string;
    GRADE: number;
    SUBSTRATE: string;
    COATING: string;
    BSG: string;
    CNSC: string;
    DCON: number;
    LF: number;
    BD1: number;
    BD2: number;
    DN:number;
    LB1:number;
    LB2:number;
    BHTA1: number;
    BHTA2: number;
    FHA: number;
    GAMF: number;
    GAMP: number;
    NORGMX: number;
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
            throw new Error(e.message);
        }
    };

    static async getAll () : Promise<MonoMillPropertyType[]>{
        try {
            const [results]
                = await pool.execute('SELECT * from `mono_mill_tool`') as [MonoMillingToolObject[]];
            return results.map((mill) => new MonoMillingToolRecord(mill).monoMillTool);
        }
        catch (e) {
            throw new Error(e.message);
        }
    };

    static async getAllByType (type: string) : Promise<MonoMillPropertyType[]>{
        try {
            const [results]
                = await pool.execute('SELECT * from `mono_mill_tool` where `type`=:type',{
                    type,
            }) as [MonoMillingToolObject[]];
            return results.map((mill) => new MonoMillingToolRecord(mill).monoMillTool);
        }
        catch (e) {
            throw new Error(e.message);
        }
    };
};