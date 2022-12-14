import {pool} from "../database";
import {TurningHolderRecord} from "../Records/TurningHolderRecord";
import {CuttingInsertRecord} from "../Records/CuttingInsertRecord";
import {AssemblyItemRecord} from "../Records/AssemblyItemRecord";
import {MillingHolderPropertyType, MillingHolderRecord} from "../Records/MillingHolderRecord";
import {MonoMillingToolRecord, MonoMillPropertyType} from "../Records/MonoMillingToolRecord";
import {
    AssemblyMillItemPropertyType,
    AssemblyMillItemRecord,
} from "../Records/AssemblyMillItemRecord";
import {
    CuttingInsertMillProperty,
    CuttingInsertMillRecord,
    CuttingInsertMillRecordType
} from "../Records/CuttingInsertMillRecord";

export interface GetTurningReturn {
    turningHolder: TurningHolderRecord;
    cuttingInsert: CuttingInsertRecord;
    assemblyItem: AssemblyItemRecord;
}

export interface GetMillingReturn {
    INSERT_FOR_MILL: CuttingInsertMillRecordType;
    INSERT_FOR_SLOT_CUT: CuttingInsertMillRecordType;
    CASSETTE: AssemblyMillItemPropertyType;
    INSERT_SCREW_MILL: AssemblyMillItemPropertyType;
    CLAMPING_WEDGE_MILL: AssemblyMillItemPropertyType;
    WEDGE_SCREW: AssemblyMillItemPropertyType;
    BIT: AssemblyMillItemPropertyType;
    KEY: AssemblyMillItemPropertyType;
    TORQUE_WRENCH: AssemblyMillItemPropertyType;
    ISO50: AssemblyMillItemPropertyType;
    COLLET: AssemblyMillItemPropertyType;
    END_MILL_MONO_HOLDER: MonoMillPropertyType;
    DISC_CUTTER_HOLDER: MillingHolderPropertyType;
    END_MILL_HOLDER: MillingHolderPropertyType;
}

export const getTurningAssemblyTools = async (id: string): Promise<GetTurningReturn> => {
    try {
        const [[turningHolderList]] = await pool.execute('select * from `turning_holder_list` where `assembly_id`=:toolId',{
            toolId: id,
        });
        const [[cuttingInsertList]] = await pool.execute('select * from `cutting_insert_list` where `assembly_id`=:toolId',{
            toolId: id,
        });
        const [[assemblyItemList]] = await pool.execute('select * from `assembly_item_list` where `assembly_id`=:toolId',{
            toolId: id,
        });
        const turningHolder = await TurningHolderRecord.getOne(turningHolderList.turning_holder_id);
        const cuttingInsert = await CuttingInsertRecord.getOne(cuttingInsertList.cutting_insert_id);
        const assemblyItem = await AssemblyItemRecord.getOne(assemblyItemList.assembly_item_id);
        return {
            turningHolder,
            cuttingInsert,
            assemblyItem,
        };
    }
    catch (e) {
        return null;
    }
};

const getMillHolder = async (mill_holder_id: string) => {
    const millHolder = await MillingHolderRecord.getOne(mill_holder_id);
    return millHolder || await MonoMillingToolRecord.getOne(mill_holder_id);
};

const getMillAssemblyItems = async (assemblyItemList: {
    id: string,
    assembly_id:string,
    assembly_item_id: string,
}[]) => {
    const items = [];

    for (let assemblyItem of assemblyItemList) {
      const item = await AssemblyMillItemRecord.getOne(assemblyItem.assembly_item_id);
      items.push(item);
    }

    return items;
};

const reduceToolsToProperObject = (tools: any) => {
    const toolsObjects = tools.filter((tool: {}) => {
        return typeof tool === 'object' && !Array.isArray(tool)
    });
    const [toolsArray] = tools.filter((tool: {}[]) => Array.isArray(tool));

    const firstPartOfObject = toolsObjects.reduce((acc: {}, curr: { type: string; }) => {
       return {
           ...acc,
           [curr.type]: {
               ...curr,
           }
       }
    },{})

    return toolsArray.reduce((acc: {}, curr: { type: string; }) => {
        return {
            ...acc,
            [curr.type]: {
                ...curr,
            }
        }
    }, firstPartOfObject);
};

export const getMillingAssemblyTools = async (id: string) : Promise<GetMillingReturn> => {
    try {
        const [[millingHolderList]] = await pool.execute('select * from `mill_holder_list` where `assembly_id`=:toolId',{
            toolId: id,
        });
        const [[cuttingInsertList]] = await pool.execute('select * from `cutting_insert_list` where `assembly_id`=:toolId',{
            toolId: id,
        });
        const [assemblyItemList] = await pool.execute('select * from `assembly_item_list` where `assembly_id`=:toolId',{
            toolId: id,
        });

        const millHolder = await getMillHolder(millingHolderList.mill_holder_id) as MonoMillPropertyType|MillingHolderPropertyType;
        const cuttingInsert = cuttingInsertList ? await CuttingInsertMillRecord.getOne(cuttingInsertList.cutting_insert_id) as CuttingInsertMillProperty : null;
        const assemblyItems = await getMillAssemblyItems(assemblyItemList) as AssemblyMillItemPropertyType[];

        return reduceToolsToProperObject([
            millHolder,
            cuttingInsert,
            assemblyItems,
        ].filter((elem) => elem));
    }
    catch (e) {
        return null;
    }
};