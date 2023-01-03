import {Request, Response} from "express";
import {MonoMillingToolRecord} from "../Records/MonoMillingToolRecord";

export const getSingleMonoMillTool = async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await MonoMillingToolRecord.getOne(id);
    res.status(200).send(item);
};

export const getAllMonoMillTools = async (req: Request, res: Response) => {
    const items = await MonoMillingToolRecord.getAllByType('END_MILL_MONO_HOLDER');
    res.status(200).send(items);
};

export const getAllMonoMillSlotTools = async (req: Request, res: Response) => {
    const items = await MonoMillingToolRecord.getAllByType('ANGLE_CUTTER');
    res.status(200).send(items);
};