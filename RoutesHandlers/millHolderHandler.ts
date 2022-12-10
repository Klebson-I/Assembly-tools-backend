import {Request, Response} from "express";
import {MillingHolderRecord} from "../Records/MillingHolderRecord";

export const getSingleMillHolder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await MillingHolderRecord.getOne(id);
    res.status(200).send(item);
};