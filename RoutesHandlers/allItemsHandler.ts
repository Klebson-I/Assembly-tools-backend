import {Request, Response} from "express";
import {TurningHolderRecord} from "../Records/TurningHolderRecord";
import {CuttingInsertRecord} from "../Records/CuttingInsertRecord";
import {AssemblyItemRecord} from "../Records/AssemblyItemRecord";

export const getAllItems = async (req: Request, res: Response) => {
    const results = await Promise.all([TurningHolderRecord.getAll(), CuttingInsertRecord.getAll(), AssemblyItemRecord.getAll()]);
    const sortedItems = {
        cuttingInsertItems : results.find((itemsSubArr) => itemsSubArr.some((item) => item instanceof CuttingInsertRecord)),
        turningHolderItems : results.find((itemsSubArr) => itemsSubArr.some((item) => item instanceof TurningHolderRecord)),
        assemblyItems: results.find((itemsSubArr) => itemsSubArr.some((item) => item instanceof AssemblyItemRecord)),
    }
    res.status(200).send(sortedItems);
};