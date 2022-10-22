import {pool} from "../database";

interface AssemblyItemRecordType {
    id: string;
    BMC: string;
    KGRPTP1: string;
    KGRPS1: string;
    HDD: number;
    TA: number;
    TDZ2: string;
    THDH2: string;
    THLGTH2: number;
    OAL: number;
    LB: number;
    WT: number;
    match_code: string;
}

export class AssemblyItemRecord {
    id: string;
    BMC: string;
    KGRPTP1: string;
    KGRPS1: string;
    HDD: number;
    TA: number;
    TDZ2: string;
    THDH2: string;
    THLGTH2: number;
    OAL: number;
    LB: number;
    WT: number;
    match_code: string;

    constructor (AssemblyItemRecordObject: AssemblyItemRecordType) {
        this.id = AssemblyItemRecordObject.id;
        this.BMC = AssemblyItemRecordObject.BMC;
        this.KGRPTP1 = AssemblyItemRecordObject.KGRPTP1;
        this.KGRPS1 = AssemblyItemRecordObject.KGRPS1;
        this.HDD = AssemblyItemRecordObject.HDD;
        this.TA = AssemblyItemRecordObject.TA;
        this.TDZ2 = AssemblyItemRecordObject.TDZ2;
        this.THDH2 = AssemblyItemRecordObject.THDH2;
        this.THLGTH2 = AssemblyItemRecordObject.THLGTH2;
        this.OAL = AssemblyItemRecordObject.OAL;
        this.LB = AssemblyItemRecordObject.LB;
        this.WT = AssemblyItemRecordObject.WT;
        this.match_code = AssemblyItemRecordObject.match_code;
    }

    static async getAll () {
        try {
            const [results]
                = await pool.execute('SELECT * from `assembly_item`') as [AssemblyItemRecord[]];
            return results.map((assembly_item) => new AssemblyItemRecord(assembly_item));
        }
        catch (e) {
            console.log('DB error')
        }
    }

    static async getAllByMatchingParams (param : string) {
        try {
            const [results]
                = await pool.execute('SELECT * from `assembly_item` where `match_code` = :param',{
                param
            }) as [AssemblyItemRecord[]];
            return results.map((assembly_item) => new AssemblyItemRecord(assembly_item));
        }
        catch (e) {
            console.log('DB error')
        }
    }
}