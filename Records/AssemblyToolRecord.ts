import {pool} from "../database";
import {getMillingAssemblyTools, getTurningAssemblyTools} from "../functions/getTurningAssemblyTools";

export interface AssemblyToolRecord {
    id: string;
    type: string;
    name: string;
}

export class AssemblyToolRecord {
    id: string;
    type: string;
    name: string;

    constructor (AssemblyToolRecordObject: AssemblyToolRecord) {
        this.id = AssemblyToolRecordObject.id;
        this.type = AssemblyToolRecordObject.type;
        this.name = AssemblyToolRecordObject.name;
    }

    async delete () : Promise<any> {
        const promiseArray = [
            pool.execute('delete  from `assembly_tool` where `id`=:id',{id: this.id}),
            pool.execute('delete  from `assembly_item_list` where `assembly_id`=:id',{id: this.id}),
            pool.execute('delete  from `cutting_insert_list` where `assembly_id`=:id',{id: this.id}),
            pool.execute('delete  from `turning_holder_list` where `assembly_id`=:id',{id: this.id})
            ];
        return await Promise.all(promiseArray);
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
        return await Promise.all(promiseArray)
    }

    static async getAllAssemblyToolsForMilling () {
        const [results] = await pool.execute('select * from `assembly_tool` where `type`="MILLING"') as [AssemblyToolRecord[]];
        const promiseArray = results.map(async ({ id, name }) => {
            const toolObject = await getMillingAssemblyTools(id);
            return {
                id,
                name,
                ...toolObject,
            }
        })
        return await Promise.all(promiseArray)
    }

    static async getOne (id: string) : Promise<AssemblyToolRecord | null> {
        const [results] = await pool.execute('select * from `assembly_tool` where `id`=:id',{id}) as [AssemblyToolRecord[]];
        return results.length ? new AssemblyToolRecord(results[0]) : null;
    }
}