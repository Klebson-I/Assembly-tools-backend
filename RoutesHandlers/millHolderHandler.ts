import {Request, Response} from "express";
import {MillingHolderRecord} from "../Records/MillingHolderRecord";
import {MonoMillingToolRecord} from "../Records/MonoMillingToolRecord";

export const getSingleMillHolder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await MillingHolderRecord.getOne(id);
    res.status(200).send(item);
};

export const getAllMillsHoldersAndMonoTools = async (req: Request, res: Response) => {
    const items = await Promise.all([MillingHolderRecord.getAll(), MonoMillingToolRecord.getAll()]);
    const flatItems= items.flatMap((subArr) => subArr.map((elem) => elem));
    res.status(200).send(flatItems);
};