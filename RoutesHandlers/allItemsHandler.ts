import {Request, Response} from "express";
import {TurningHolderRecord} from "../Records/TurningHolderRecord";
import {CuttingInsertRecord} from "../Records/CuttingInsertRecord";
import {AssemblyItemRecord} from "../Records/AssemblyItemRecord";
import {MillingHolderRecord} from "../Records/MillingHolderRecord";
import {MonoMillingToolRecord} from "../Records/MonoMillingToolRecord";
import {CuttingInsertMillRecord} from "../Records/CuttingInsertMillRecord";
import {AssemblyMillItemRecord} from "../Records/AssemblyMillItemRecord";

const arrayOfAssemblyMillItemsTypes =
    ['CASSETTE', 'INSERT_SCREW_MILL', 'CLAMPING_WEDGE_MILL', 'WEDGE_SCREW', 'BIT', 'KEY', 'TORQUE_WRENCH'];

const arrayOfMillingHolderItemsTypes = ['DISC_CUTTER_HOLDER', 'END_MILL_HOLDER'];

const arrayOfCuttingInsertMillTypes = ['INSERT_FOR_MILL', 'INSERT_FOR_SLOT_CUT'];

export const getAllItems = async (req: Request, res: Response) => {
    const results = await Promise.all([
        TurningHolderRecord.getAll(),
        CuttingInsertRecord.getAll(),
        AssemblyItemRecord.getAll(),
        MillingHolderRecord.getAll(),
        MonoMillingToolRecord.getAll(),
        CuttingInsertMillRecord.getAll(),
        AssemblyMillItemRecord.getAll(),
    ]);
    const sortedItems = {
        cuttingInsertItems : results.find((itemsSubArr) => itemsSubArr.some((item) => item instanceof CuttingInsertRecord)),
        turningHolderItems : results.find((itemsSubArr) => itemsSubArr.some((item) => item instanceof TurningHolderRecord)),
        assemblyItems: results.find((itemsSubArr) => itemsSubArr.some((item) => item instanceof AssemblyItemRecord)),
        millingHolderItems: results.find((itemsSubArr) => itemsSubArr.some((item) =>  arrayOfMillingHolderItemsTypes.includes(item.type))),
        monoMillingTools: results.find((itemsSubArr) => itemsSubArr.some((item) => item.type === 'END_MILL_MONO_HOLDER')),
        cuttingInsertMill: results.find((itemsSubArr) => itemsSubArr.some((item) => arrayOfCuttingInsertMillTypes.includes(item.type))),
        assemblyMillItems: results.find((itemsSubArr) => itemsSubArr.some(
            (item) => arrayOfAssemblyMillItemsTypes.includes(item.type))
        ),
    };
    res.status(200).send(sortedItems);
};