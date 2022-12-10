import {Request, Response} from "express";
import {CuttingInsertMillRecord, CuttingInsertMillType} from "../Records/CuttingInsertMillRecord";

export const getSingleCuttingInsertMill = async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await CuttingInsertMillRecord.getOne(id);
    res.status(200).send(item);
}

export const getCuttingInsertMillByShapeAndSize = async (req: Request, res: Response) => {
    const { type, shape, size } = req.params;
    const items = await CuttingInsertMillRecord.getAllByType(type as CuttingInsertMillType);
    const inserts = items.filter(({IS, SC}) => Number(IS) === Number(size) && SC === shape);
    console.log(inserts);
    res.status(200).send(inserts);
};