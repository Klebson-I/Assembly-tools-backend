import {pool} from "../database";

interface Param {
    id: string;
    param_id: string;
    description: string;
    unit: string | null;
}

type ParamsRecordType = Param[];

export const getParamsData = async () => {
    try {
        const [results]
            = await pool.execute('SELECT * from `param_description`') as [ParamsRecordType];
        return results.length > 0 ? results[0] : null;
    }
    catch (e) {
        console.log('DB error')
    }
};