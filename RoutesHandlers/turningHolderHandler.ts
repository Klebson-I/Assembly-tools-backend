import {Request, Response} from "express";
import {TurningHolderRecord} from "../Records/TurningHolderRecord";


export const getAllTurningHoldersItems = async (req: Request, res: Response) => {
    const allTurningHolderItems = await TurningHolderRecord.getAll();
    res.status(200).send(allTurningHolderItems);
};

export const getAllTurningHoldersItemsByInsert = async (req: Request, res: Response) => {
    const { shape, size } =req.params;
    const allMatchingTurningHolderItems = await TurningHolderRecord.getAllByInsertShapeAndSize(shape, size);
    res.status(200).send(allMatchingTurningHolderItems);
};

export const getTurningHolderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id)
    const item = await TurningHolderRecord.getOne(id);
    if (item) {
        res.status(200).send(item);
        return;
    }
    res.status(205).send({msg: 'No tool found'});
};