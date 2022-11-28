import {pool} from "../database";
import {TurningHolderRecord} from "../Records/TurningHolderRecord";
import {CuttingInsertRecord} from "../Records/CuttingInsertRecord";
import {AssemblyItemRecord} from "../Records/AssemblyItemRecord";

interface GetTurningReturn {
    turningHolder: TurningHolderRecord;
    cuttingInsert: CuttingInsertRecord;
    assemblyItem: AssemblyItemRecord;
};

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
        console.log(e);
        return null;
    }
};