import {Request, Response} from "express";
import {MillingHolderRecord} from "../Records/MillingHolderRecord";

export const getSingleMillHolder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await MillingHolderRecord.getOne(id);
    res.status(200).send(item);
};

export const getAllMillsHoldersAndMonoTools = async (req: Request, res: Response) => {
    const { type : toolType } = req.params;
    const items = await MillingHolderRecord.getAll();
    const selectedTypeHolders = items.filter(({type}) => type === toolType);
    res.status(200).send(selectedTypeHolders);
};