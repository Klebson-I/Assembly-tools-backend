import {pool} from "../database";

export interface AssemblyMillItemRecordType {
    id: string;
    name: string|null;
    type: string;
    BMC: string|null;
    KGRPTP1: string;
    KGRPS1: string;
    HDD: number;
    TA: number;
    TDZ2: string;
    THDH2: string;
    THLGTH2: number;
    OAL: number;
    CXSC: string;
    CNSC: string;
    LB: number;
    WT: number;
    KGRPTP2: string;
    KGRPS2: string;
    LU1: number;
    TQN: number;
    TQX: number;
};

export type AssemblyMillItemPropertyType = Record<null|string|number, keyof AssemblyMillItemRecordType>;

export type AssemblyMillItemType = 'CASSETTE' | 'INSERT_SCREW_MILL' | 'CLAMPING_WEDGE_MILL'
    | 'WEDGE_SCREW' | 'BIT' | 'KEY' | 'TORQUE_WRENCH';

export class AssemblyMillItemRecord {
    assemblyMillItem: AssemblyMillItemPropertyType = {};

    constructor(obj: AssemblyMillItemRecordType) {
        const entries = Object.entries(obj);
        for (let [entryName, value] of entries) {
            this.assemblyMillItem[entryName] = value;
        }
    }

    static async getOne (id: string) : Promise<AssemblyMillItemPropertyType|null>{
        try {
            const [results]
                = await pool.execute('SELECT * from `assembly_mill_item` where `id`=:id',{
                id
            }) as [AssemblyMillItemRecordType[]];
            const item = results.map((item) => new AssemblyMillItemRecord(item));
            return item.length > 0 ? item[0].assemblyMillItem : null;
        }
        catch (e) {
            console.log('DB error');
        }
    };

    static async getAll () : Promise<AssemblyMillItemPropertyType[]> {
        try {
            const [results]
                = await pool.execute('SELECT * from `assembly_mill_item`') as [AssemblyMillItemRecordType[]];
            return results.map((item) => (new AssemblyMillItemRecord(item).assemblyMillItem));
        }
        catch (e) {
            console.log(e);
        }
    };

    static async getAllByType (type: AssemblyMillItemType) : Promise<AssemblyMillItemPropertyType[]> {
        try {
            const [results]
                = await pool.execute('SELECT * from `assembly_mill_item` where `type`=:type',{
                type,
            }) as [AssemblyMillItemRecordType[]];
            return results.map((item) => new AssemblyMillItemRecord(item).assemblyMillItem);
        }
        catch (e) {
            console.log('DB error');
        }
    };

};