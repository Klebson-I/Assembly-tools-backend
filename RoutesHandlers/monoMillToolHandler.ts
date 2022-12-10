import {Request, Response} from "express";
import {MonoMillingToolRecord} from "../Records/MonoMillingToolRecord";

export const getSingleMonoMillTool = async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await MonoMillingToolRecord.getOne(id);
    res.status(200).send(item);
};