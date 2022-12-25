import {pool} from "../database";
import {DrillRecordType} from "../Records/DrillRecord";
import {MillingHolderRecordType} from "../Records/MillingHolderRecord";
import {CuttingInsertMillProperty, CuttingInsertMillRecord} from "../Records/CuttingInsertMillRecord";
import {AssemblyMillItemPropertyType, AssemblyMillItemRecord} from "../Records/AssemblyMillItemRecord";

type actionName = 'internal slot'|
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
}

type ParametersObjectType = Omit<StartAutoAssemblyProperties, 'action'>;
type DrillHoleTools = (MillingHolderRecordType | CuttingInsertMillProperty | AssemblyMillItemPropertyType | DrillRecordType)[];
type EndMillForDrillTool = (MillingHolderRecordType | CuttingInsertMillProperty | AssemblyMillItemPropertyType)[];
type MillForCutBarTool = (MillingHolderRecordType|CuttingInsertMillProperty|AssemblyMillItemPropertyType)[];

export class AutoAssemblyTool implements StartAutoAssemblyProperties{
    readonly action: actionName;
    readonly D?: number;
    readonly L?: number;
    readonly L2?: number;
    readonly L3?: number;

    constructor(obj: StartAutoAssemblyProperties) {
        this.action = obj.action;
        this.L = obj?.L || null;
        this.D = obj?.D || null;
        this.L2 = obj?.L2 || null;
        this.L3 = obj?.L3 || null;
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

        const cuttingInserts = await CuttingInsertMillRecord.getAllToMillHolder(millHolder);
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
            millHolder,
            cuttingInsert,
            insertScrewMill,
            bit,
        ]
    }

    async getToolForHole () :  Promise<DrillHoleTools> {
        if (!this.D || !this.L) {
            throw new Error('Bad params');
        }
        const toolLength = this.action === 'through hole'
            ? this.L/2
            : this.L;
        const [results] = await pool.execute('SELECT * from `drill` where `DC`<= :D and `LU`>=:L ORDER BY `DC` DESC', {
            D: this.D,
            L: toolLength,
        }) as [DrillRecordType[]];
        if (!results.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const drill = results[0];
        if (drill?.DC === this.D) {
            return [drill];
        }
        const millAssemblyTool = await this.getProperMillToolForHole();

        return [...millAssemblyTool, drill];
    }

    async getToolForCutBar () : Promise<MillForCutBarTool> {
        if (!this.D || !this.L || !this.L2 || !this.L3) {
            throw new Error('Bad params');
        }
        const DC = this.D/2;
        const LF = this.L - this.L2 - this.L3;

        const [holders] = await pool.execute('SELECT * from `milling_holder` WHERE `type`=:type AND `DC`>=:DC AND `LF`<:LF ORDER BY `DC` ASC',{
            DC,
            LF,
            type: 'DISC_CUTTER_HOLDER',
        });
        if (!holders.length) {
            throw new Error('No tools for operation with selected parameters');
        }
        const holder = holders[0];

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
            holder,
            cuttingInsert,
            cassette,
            insertScrewMill,
            wedge,
            wedgeScrew,
            bit,
            key
        ]
    }

};