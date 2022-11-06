import {pool} from "../database";
import {TurningHolderRecord} from "./TurningHolderRecord";
import {CuttingInsertRecord} from "./CuttingInsertRecord";
import {AssemblyItemRecord} from "./AssemblyItemRecord";

export interface AssemblyToolRecord {
    id: string;
    type: string;
    turning_holder_list: string;
    cutting_insert_list: string;
    assembly_item_list: string;
}

export class AssemblyToolRecord {
    id: string;
    type: string;
    turning_holder_list: string;
    cutting_insert_list: string;
    assembly_item_list: string;

    constructor (AssemblyToolRecordObject: AssemblyToolRecord) {
        this.id = AssemblyToolRecordObject.id;
        this.type = AssemblyToolRecordObject.type;
        this.turning_holder_list = AssemblyToolRecordObject.turning_holder_list;
        this.cutting_insert_list = AssemblyToolRecordObject.cutting_insert_list;
        this.assembly_item_list = AssemblyToolRecordObject.assembly_item_list;
    }

    async delete () : Promise<any> {
        const promiseArray = [
            pool.execute('delete  from `assembly_tool` where `id`=:id',{id: this.id}),
            pool.execute('delete  from `assembly_item_list` where `assembly_id`=:id',{id: this.id}),
            pool.execute('delete  from `cutting_insert_list` where `assembly_id`=:id',{id: this.id}),
            pool.execute('delete  from `turning_holder_list` where `assembly_id`=:id',{id: this.id})
            ];
        const results = await Promise.all(promiseArray);
        return results;
    }

    static async getAllAssemblyToolsForTurning () {
        const [results] = await pool.execute('select * from `assembly_tool` where `type`="TURNING"') as [AssemblyToolRecord[]];
        const promiseArray = results.map(async ({ id: toolId }) => {
            const [[turningHolderList]] = await pool.execute('select * from `turning_holder_list` where `assembly_id`=:toolId',{
                toolId,
            });
            const [[cuttingInsertList]] = await pool.execute('select * from `cutting_insert_list` where `assembly_id`=:toolId',{
                toolId,
            });
            const [[assemblyItemList]] = await pool.execute('select * from `assembly_item_list` where `assembly_id`=:toolId',{
                toolId,
            });
            const turningHolder = await TurningHolderRecord.getOne(turningHolderList.turning_holder_id);
            const cuttingInsert = await CuttingInsertRecord.getOne(cuttingInsertList.cutting_insert_id);
            const assemblyItem = await AssemblyItemRecord.getOne(assemblyItemList.assembly_item_id);
            return {
                id: toolId,
                TURNING_HOLDER: turningHolder,
                CUTTING_INSERT: cuttingInsert,
                ASSEMBLY_ITEM: assemblyItem,
            };
        })
        const assemblyToolsList = await Promise.all(promiseArray)
        return assemblyToolsList;
    }

    static async getOne (id: string) : Promise<AssemblyToolRecord | null> {
        const [results] = await pool.execute('select * from `assembly_tool` where `id`=:id',{id}) as [AssemblyToolRecord[]];
        return results.length ? new AssemblyToolRecord(results[0]) : null;
    }
}