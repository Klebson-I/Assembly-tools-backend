import {pool} from "../database";
import {TurningHolderRecord} from "./TurningHolderRecord";
import {CuttingInsertRecord} from "./CuttingInsertRecord";
import {AssemblyItemRecord} from "./AssemblyItemRecord";
import {getTurningAssemblyTools} from "../functions/getTurningAssemblyTools";

export interface AssemblyToolRecord {
    id: string;
    type: string;
    turning_holder_list: string;
    cutting_insert_list: string;
    assembly_item_list: string;
    name: string;
}

export class AssemblyToolRecord {
    id: string;
    type: string;
    turning_holder_list: string;
    cutting_insert_list: string;
    assembly_item_list: string;
    name: string;

    constructor (AssemblyToolRecordObject: AssemblyToolRecord) {
        this.id = AssemblyToolRecordObject.id;
        this.type = AssemblyToolRecordObject.type;
        this.turning_holder_list = AssemblyToolRecordObject.turning_holder_list;
        this.cutting_insert_list = AssemblyToolRecordObject.cutting_insert_list;
        this.assembly_item_list = AssemblyToolRecordObject.assembly_item_list;
        this.name = AssemblyToolRecordObject.name;
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
        const promiseArray = results.map(async ({ id, name }) => {
           const { turningHolder, cuttingInsert, assemblyItem } = await getTurningAssemblyTools(id)
            return {
                id,
                name,
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