import {Request, Response} from "express";
import {CuttingInsertRecord} from "../Records/CuttingInsertRecord";

export const getAllCuttingInsertItems = async (req: Request, res: Response) => {
    const allCuttingInsertItems = await CuttingInsertRecord.getAll();
    res.status(200).send(allCuttingInsertItems);
};

export const getAllCuttingInsertItemsByMatch = async (req: Request, res: Response) => {
    const { shape, size } = req.params;
    const allMatchingCuttingInsertItems = await CuttingInsertRecord.getAllByHolderShapeAndSize(shape, size);
    res.status(200).send(allMatchingCuttingInsertItems);
};

export const getCuttingInsertById = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id)
    const item = await CuttingInsertRecord.getOne(id);
    if (item) {
        res.status(200).send(item);
        return;
    }
    res.status(205).send({msg: 'No tool found'});
}