import {Request, Response} from "express";
import {CuttingInsertMillRecord} from "../Records/CuttingInsertMillRecord";

export const getSingleCuttingInsertMill = async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await CuttingInsertMillRecord.getOne(id);
    res.status(200).send(item);
}