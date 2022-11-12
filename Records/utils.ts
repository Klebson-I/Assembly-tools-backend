import {CuttingInsertRecordType} from "./CuttingInsertRecord";
import {TurningHolderRecordType} from "./TurningHolderRecord";
import {AssemblyItemRecordType} from "./AssemblyItemRecord";
import {pool} from "../database";
import {v4 as uuid} from 'uuid';

interface ToolObject {
    action: string;
    CUTTING_INSERT?: CuttingInsertRecordType,
    TURNING_HOLDER?: TurningHolderRecordType,
    ASSEMBLY_ITEM?: AssemblyItemRecordType,
    name: string;
}

const putTurningAssemblyToolToDatabase = async (toolObject: ToolObject) => {
    const newAssemblyToolId = uuid();
    const newCuttingInsertListId = uuid();
    const newTurningHolderListId = uuid();
    const newAssemblyItemListId = uuid();

    const listPromises =  [
        pool.execute('insert into `cutting_insert_list` values(:id, :assembly_id, :cutting_insert_id)',{
            id: newCuttingInsertListId,
            assembly_id: newAssemblyToolId,
            cutting_insert_id: toolObject.CUTTING_INSERT.id,
        }),
        pool.execute('insert into `turning_holder_list` values(:id, :assembly_id, :turning_holder_id)',{
            id: newTurningHolderListId,
            assembly_id: newAssemblyToolId,
            turning_holder_id: toolObject.TURNING_HOLDER.id,
        }),
        pool.execute('insert into `assembly_item_list` values(:id, :assembly_id, :assembly_item_id)',{
            id: newAssemblyItemListId,
            assembly_id: newAssemblyToolId,
            assembly_item_id: toolObject.ASSEMBLY_ITEM.id,
        }),
    ];

    await Promise.all(listPromises);

    await pool.execute('insert into `assembly_tool` values(:id, :type, :turning_holder_list, :cutting_insert_list, :assembly_item_list, :name)',{
        id: newAssemblyToolId,
        type: toolObject.action,
        turning_holder_list: newTurningHolderListId,
        cutting_insert_list: newCuttingInsertListId,
        assembly_item_list: newAssemblyItemListId,
        name: toolObject.name,
    })
};

export const putAssemblyToolInDatabase = async (toolObject: ToolObject) => {
    if (toolObject.action === 'TURNING') {
        await putTurningAssemblyToolToDatabase(toolObject);
    }
}

