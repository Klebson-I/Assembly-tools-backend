import {pool} from "../database";
import {DrillRecordType} from "../Records/DrillRecord";
import {MillingHolderRecordType} from "../Records/MillingHolderRecord";
import {CuttingInsertMillProperty, CuttingInsertMillRecord} from "../Records/CuttingInsertMillRecord";
import {AssemblyMillItemPropertyType, AssemblyMillItemRecord} from "../Records/AssemblyMillItemRecord";
import {MonoMillingToolObject, MonoMillingToolRecord} from "../Records/MonoMillingToolRecord";
import {CuttingInsertRecord} from "../Records/CuttingInsertRecord";
import {AssemblyItemRecord} from "../Records/AssemblyItemRecord";
import {TurningHolderRecord} from "../Records/TurningHolderRecord";

type actionName = 'V slot'|
    'side slot'|
    'cut bar'|
    'surface planning'|
    'through hole'|
    'no-through hole'|
    'pocket'|
    'open pocket'|
    'external groove'|
    'face planning';

interface StartAutoAssemblyProperties  {
    readonly action: actionName;
    readonly D?: number;
    readonly L?: number;
    readonly L2?: number;
    readonly L3?:number;
    readonly H?: number;
    readonly AP?: number;
    readonly R?: number;
    readonly R1?: number;
    readonly R2?: number;
    readonly IT?: string;
    readonly BOTTOM?: string;
    readonly deg?: string;
    readonly HAND?: string;
}

type ParametersObjectType = Omit<StartAutoAssemblyProperties, 'action'>;
type DrillHoleTools = (MillingHolderRecordType | CuttingInsertMillProperty | AssemblyMillItemPropertyType | DrillRecordType)[];
type EndMillForDrillTool = (MillingHolderRecordType | CuttingInsertMillProperty | AssemblyMillItemPropertyType)[];
type MillForCutBarTool = (MillingHolderRecordType|CuttingInsertMillProperty|AssemblyMillItemPropertyType)[];
type MillForSideSlotTool = MillForCutBarTool;
type MillForRoughSurfacePlanningTools = MillForCutBarTool;

export class AutoAssemblyTool implements StartAutoAssemblyProperties{
    readonly action: actionName;
    readonly D?: number;
    readonly L?: number;
    readonly L2?: number;
    readonly L3?: number;
    readonly H?: number;
    readonly AP?: number;
    readonly R?: number;
    readonly IT?: string;
    readonly BOTTOM?: string;
    readonly deg?: string;
    readonly R1?: number;
    readonly R2?: number;
    readonly HAND?: string;

    private drillsForITClass : any = {
        IT6_10 : {
            2: [1.9, 2],
            3: [2.8, 3],
            4: [3.5, 3.8, 4],
            5: [4.5, 4.8, 5],
            6: [5.5, 5.8, 6],
            7: [6.5, 6.8, 7],
            8: [7, 7.8, 8],
            9: [8, 8.8, 9],
            10: [9, 9.8, 10],
            11: [10, 10.75, 11],
            12: [11, 11.75, 12],
            13: [12, 12.75, 13],
            14: [13, 13.75, 14],
            15: [13.75, 14.75, 15],
            16: [14.75, 15.75, 16],
            20: [18.5, 19.7, 20],
            25: [12, 23.5, 24.7, 25],
        },
        IT11: {
            2: [2],
            3: [2.8, 3],
            4: [3.8, 4],
            5: [4.8, 5],
            6: [5.8, 6],
            7: [6.8, 7],
            8: [7.5, 8],
            9: [8.5, 9],
            10: [9.5, 10],
            11: [10.5, 11],
            12: [11.5, 12],
            13: [12.5, 13],
            14: [13.5, 14],
            15: [14.5, 15],
            16: [15.5, 16],
            20: [19.5, 20],
            25: [12, 24.5, 25],
        },
    };

    constructor(obj: StartAutoAssemblyProperties) {
        this.action = obj.action;
        this.L = obj?.L || null;
        this.D = obj?.D || null;
        this.L2 = obj?.L2 || null;
        this.L3 = obj?.L3 || null;
        this.H = obj?.H || null;
        this.AP = obj?.AP || null;
        this.R = obj?.R || null;
        this.IT = obj?.IT || null;
        this.BOTTOM = obj?.BOTTOM || null;
        this.deg = obj?.deg || null;
        this.R1 = obj?.R1 || null;
        this.R2 = obj?.R2 || null;
        this.HAND = obj?.HAND || null;
    }

    async getProperMillToolForHole () : Promise<EndMillForDrillTool> {
        if (!this.D || !this.L) {
            throw new Error('Bad params');
        }
        const toolLength = this.action === 'through hole'
            ? this.L/2
            : this.L;

        const [results] = await pool.execute('SELECT * from `milling_holder` where `DCON` < `DC` and `type`=:type and `DC`<= :D and `LF`>:L ORDER BY `DC` DESC', {
            D: this.D,
            L: toolLength,
            type: 'END_MILL_HOLDER',
        }) as [MillingHolderRecordType[]];
        if (!results?.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const millHolder = results[0];

        const assemblies = await this.getAllNecessaryAssembliesForEndMillHolder(millHolder);

        return [
            millHolder,
            ...assemblies,
        ]
    }

    async getToolForHole () :  Promise<DrillRecordType[]> {
        if (!this.D || !this.L || !this.IT) {
            throw new Error('Bad params');
        }
        const toolLength = this.action === 'through hole'
            ? this.L/2
            : this.L;
        const [results] = await pool.execute('SELECT * from `drill` where `DC`<= :D and `LU`>=:L ORDER BY `DC` ASC', {
            D: this.D,
            L: toolLength,
        }) as [DrillRecordType[]];

        if (!results.length) {
            throw new Error('No tools for operation with selected parameters');
        }

        const drillsDiameters = this.IT !== 'IT11'
            ? this.drillsForITClass.IT6_10?.[`${this.D}`]
            : this.drillsForITClass.IT11?.[`${this.D}`];

        if (!drillsDiameters) {
            throw new Error('No tools for operation with selected parameters');
        }

        const filteredDrills = results
            .filter(({DC}) => drillsDiameters.includes(Number(DC.toFixed(2))))
            .reduce((acc, curr) => {
                const listOfDC = acc.map(({DC}) => DC);
                if (listOfDC.includes(curr.DC)) {
                    return acc;
                }
                return [
                    ...acc,
                    curr,
                ];
            },[])


        if (filteredDrills.length !== drillsDiameters.length) {
            throw new Error('No tools for operation with selected parameters');
        }

        return filteredDrills;
    }

    async getAllNecessaryAssembliesForDiscHolder (holder: MillingHolderRecordType) : Promise<MillForCutBarTool> {
        const cuttingInserts = await CuttingInsertMillRecord.getAllToMillHolder(holder);
        if (!cuttingInserts.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const cuttingInsert = cuttingInserts[0];

        const cassettes = await AssemblyMillItemRecord.getAllByType('CASSETTE');
        if (!cassettes.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const cassette = cassettes[0];

        const insertsScrewsMill = await AssemblyMillItemRecord.getAllByType('INSERT_SCREW_MILL');
        if (!insertsScrewsMill?.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const insertScrewMill = insertsScrewsMill[0];

        const bits = await AssemblyMillItemRecord.getAllByType('BIT');
        if (!bits?.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const bit = bits[0];

        const wedges = await AssemblyMillItemRecord.getAllByType('CLAMPING_WEDGE_MILL');
        if (!wedges?.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const wedge = wedges[0];

        const wedgeScrews = await AssemblyMillItemRecord.getAllByType('WEDGE_SCREW');
        if (!wedgeScrews?.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const wedgeScrew = wedgeScrews[0];

        const keys = await AssemblyMillItemRecord.getAllByType('KEY');
        if (!keys?.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const key = keys[0];

        return [
            cuttingInsert,
            cassette,
            insertScrewMill,
            wedge,
            wedgeScrew,
            bit,
            key
        ]
    }

    async getToolForCutBar () : Promise<MillForCutBarTool> {
        if (!this.D) {
            throw new Error('Bad params');
        }
        const DC = this.D/2;

        const [holders] = await pool.execute('SELECT * from `milling_holder` WHERE `type`=:type AND `DC`>=:DC ORDER BY `DC` ASC',{
            DC,
            type: 'DISC_CUTTER_HOLDER',
        });
        if (!holders.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const holder = holders[0];
        const assemblies = await this.getAllNecessaryAssembliesForDiscHolder(holder);

        return [
            holder,
            ...assemblies,
        ]
    }

    async getToolForSideSlot () : Promise<MillForSideSlotTool>  {
        if (!this.H || !this.L || !this.L2) {
            throw new Error('Bad params');
        }
        const [holders] = await pool.execute('SELECT * from `milling_holder` WHERE `type`=:type AND `CDXBFW`<=:L AND `LF`<:H ORDER BY `DC` DESC',{
            H: this.H,
            L: this.L2,
            type: 'DISC_CUTTER_HOLDER',
        });
        if (!holders.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const holder = holders[0];
        const assemblies = await this.getAllNecessaryAssembliesForDiscHolder(holder);
        return [
            holder,
            ...assemblies,
        ]
    }

    getMaxDCForPlanning () {
        if (this.L > this.L2) {
            return this.L/2;
        }
        return this.L2 /2;
    }

    async getAllNecessaryAssembliesForEndMillHolder (holder: MillingHolderRecordType) {

        const cuttingInserts = await CuttingInsertMillRecord.getAllToMillHolder(holder);

        if (!cuttingInserts?.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const cuttingInsert = cuttingInserts[0];

        const insertsScrewsMill = await AssemblyMillItemRecord.getAllByType('INSERT_SCREW_MILL');
        if (!insertsScrewsMill?.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const insertScrewMill = insertsScrewsMill[0];

        const bits = await AssemblyMillItemRecord.getAllByType('BIT');
        if (!bits?.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const bit = bits[0];

        return [
            cuttingInsert,
            insertScrewMill,
            bit,
        ]
    }

    async getToolForRoughSurfacePlanning () : Promise<MillForRoughSurfacePlanningTools> {
        if (!this.H || !this.L || !this.L2) {
            throw new Error('Bad params');
        }
        const DC = this.getMaxDCForPlanning();
        const [holders] = await pool.execute('SELECT * from `milling_holder` WHERE `type`=:type AND `DC`<=:DC ORDER BY `DC` DESC',{
            DC,
            type: 'END_MILL_HOLDER',
        });
        if (!holders.length) {
            const [holders] = await pool.execute('SELECT * from `milling_holder` WHERE `type`=:type ORDER BY `DC` ASC',{
                DC,
                type: 'DISC_CUTTER_HOLDER',
            });
            if (!holders.length) {
                throw new Error('No tools for operation with selected parameters');
            }
            const holder = holders[0];
            const assemblies = await this.getAllNecessaryAssembliesForEndMillHolder(holder);
            return [
                holder,
                ...assemblies,
            ]
        }
        const holder = holders[0];
        const assemblies = await this.getAllNecessaryAssembliesForEndMillHolder(holder);
        return [
            holder,
            ...assemblies,
        ]
    }

    async getToolForFinishSurfacePlanning () : Promise<MonoMillingToolRecord[]> {
        if (!this.H || !this.L || !this.L2) {
            throw new Error('Bad params');
        }
        const DC = this.getMaxDCForPlanning();
        const [holders] = await pool.execute('SELECT * from `mono_mill_tool` WHERE  `DC`<=:DC ORDER BY `DC` DESC',{
            DC,
        });
        if (!holders.length) {
            const [holders] = await pool.execute('SELECT * from `mono_mill_tool` ORDER BY `DC1` DESC',);
            const holder = holders[0];
            return [holder];
        }
        const holder = holders[0];
        return [holder];
    }

    getMaxDCForPocket () {
        if (this.L < this.L2) {
            return this.L;
        }
        return this.L2;
    }

    async getRoughToolForPocket () {
        if (!this.L || !this.L2 || !this.AP || !this.R1 || !this.R2) {
            throw new Error('Bad params');
        }
        const DC = this.getMaxDCForPocket();
        const [holders] = await pool.execute('SELECT * from `milling_holder` WHERE `type`=:type AND `DC`<:DC AND `LF`>=:AP ORDER BY `DC` DESC',{
            DC,
            AP: this.AP,
            type: 'END_MILL_HOLDER',
        })

        if (!holders.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const holder = holders[0];

        const assemblies = await this.getAllNecessaryAssembliesForEndMillHolder(holder);

        return [
            holder,
            ...assemblies,
        ]
    }

    async getFinishingToolForPocket () {
        if (!this.L || !this.L2 || !this.AP || !this.R1 || !this.R2) {
            throw new Error('Bad params');
        }
        const DC = this.getMaxDCForPocket();
        const [holders] = await pool.execute('SELECT * from `mono_mill_tool` WHERE  `DC`<=:DC AND `DC`<=:R1 AND `RE`<=:R2 AND `LF`>=:AP ORDER BY `DC` DESC',{
            DC,
            R1: this.R1*2,
            R2: this.R2,
            AP:this.AP,
        });

        if (!holders.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const holder = holders[0];

        return [holder];
    }

    async getToolForVSlot () : Promise<[MonoMillingToolObject]> {
        if (!this.L || !this.H || !this.deg) {
            throw new Error('Bad params');
        }
        const [result] = await pool.execute('SELECT * from `mono_mill_tool` where `DC`=:L AND `LU`=:H AND `δ`=:deg', {
            L: this.L,
            H: this.H,
            deg: this.deg.split('deg')[0],
        }) as [MonoMillingToolObject[]];

        if (!result.length) {
            throw new Error('No tools for operation with selected parameters');
        }

        const angleCutter = result[0];

        return [angleCutter];
    }

    async getToolForFacePlanning () : Promise<[TurningHolderRecord, CuttingInsertRecord, AssemblyItemRecord]> {
        if (!this.D || !this.AP || !this.HAND) {
            throw new Error('Bad params');
        }
        const [result] = await pool.execute('SELECT * from `turning_holder` where `HAND`=:HAND AND `LF`>:D',{
            HAND: this.HAND,
            D: this.D/2
        }) as [TurningHolderRecord[]];

        if (!result.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const holder = result[0];

        const { MTP, IS } = holder;

        const cuttingInserts = await CuttingInsertRecord.getAllByHolderShapeAndSize(MTP, String(IS));

        if (!cuttingInserts.length) {
            throw new Error('No tools for operation with selected parameters');
        }

        const cuttingInsert = cuttingInserts[0];

        const { match_code } = cuttingInsert;

        const assemblyItems = await AssemblyItemRecord.getAllByMatchingParams(match_code);

        if (!assemblyItems.length) {
            throw new Error('No tools for operation with selected parameters');
        }

        const assemblyItem = assemblyItems[0];

        return [
            holder,
            cuttingInsert,
            assemblyItem,
        ]
    }

    async getToolForExternalGroove () : Promise<[TurningHolderRecord, CuttingInsertRecord, AssemblyItemRecord]> {
        if (!this.L || !this.AP || !this.HAND) {
            throw new Error('Bad params');
        }
        const [result] = await pool.execute('SELECT * from `turning_holder` where `HAND`=:HAND AND `LF`>:AP ',{
            HAND: this.HAND,
            AP: this.AP,
            L: this.L,
        }) as [TurningHolderRecord[]];

        if (!result.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const holder = result[0];

        const { MTP, IS } = holder;

        const cuttingInserts = await CuttingInsertRecord.getAllByHolderShapeAndSize(MTP, String(IS));

        const properInserts = cuttingInserts.filter(({ S }) => S < this.L)

        if (!properInserts.length) {
            throw new Error('No tools for operation with selected parameters');
        }

        const cuttingInsert = properInserts[0];

        const { match_code } = cuttingInsert;

        const assemblyItems = await AssemblyItemRecord.getAllByMatchingParams(match_code);

        if (!assemblyItems.length) {
            throw new Error('No tools for operation with selected parameters');
        }

        const assemblyItem = assemblyItems[0];

        return [
            holder,
            cuttingInsert,
            assemblyItem,
        ]
    }

};