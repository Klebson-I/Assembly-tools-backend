import {Request, Response} from "express";
import {CuttingInsertRecord} from "../Records/CuttingInsertRecord";

export const getAllCuttingInsertItems = async (req: Request, res: Response) => {
    const allCuttingInsertItems = await CuttingInsertRecord.getAll();
    res.status(200).send(allCuttingInsertItems);
};

export const getAllCuttingInsertItemsByMatch = async (req: Request, res: Response) => {
    const { match } = req.params;
    const allMatchingCuttingInsertItems = await CuttingInsertRecord.getAllByMatchingParams(match);
    res.status(200).send(allMatchingCuttingInsertItems);
};