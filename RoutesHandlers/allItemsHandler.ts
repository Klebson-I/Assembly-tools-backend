import {Request, Response} from "express";
import {TurningHolderRecord} from "../Records/TurningHolderRecord";
import {CuttingInsertRecord} from "../Records/CuttingInsertRecord";
import {AssemblyItemRecord} from "../Records/AssemblyItemRecord";
import {MillingHolderRecord} from "../Records/MillingHolderRecord";
import {MonoMillingToolRecord} from "../Records/MonoMillingToolRecord";
import {CuttingInsertMillRecord} from "../Records/CuttingInsertMillRecord";

export const getAllItems = async (req: Request, res: Response) => {
    const results = await Promise.all([
        TurningHolderRecord.getAll(),
        CuttingInsertRecord.getAll(),
        AssemblyItemRecord.getAll(),
        MillingHolderRecord.getAll(),
        MonoMillingToolRecord.getAll(),
        CuttingInsertMillRecord.getAll(),
    ]);
    const sortedItems = {
        cuttingInsertItems : results.find((itemsSubArr) => itemsSubArr.some((item) => item instanceof CuttingInsertRecord)),
        turningHolderItems : results.find((itemsSubArr) => itemsSubArr.some((item) => item instanceof TurningHolderRecord)),
        assemblyItems: results.find((itemsSubArr) => itemsSubArr.some((item) => item instanceof AssemblyItemRecord)),
        millingHolderItems: results.find((itemsSubArr) => itemsSubArr.some((item) =>  item.type === 'DISC_CUTTER_HOLDER' || item.type === 'END_MILL_HOLDER')),
        monoMillingTools: results.find((itemsSubArr) => itemsSubArr.some((item) => item.type === 'END_MILL_MONO_HOLDER')),
        cuttingInsertMill: results.find((itemsSubArr) => itemsSubArr.some((item) => item.type === 'INSERT_FOR_MILL' || item.type === 'INSERT_FOR_SLOT_CUT')),
    }
    res.status(200).send(sortedItems);
};