import {Request, Response} from "express";
import {AssemblyMillItemRecord, AssemblyMillItemType} from "../Records/AssemblyMillItemRecord";

export const getSingleAssemblyMillItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await AssemblyMillItemRecord.getOne(id);
    res.status(200).send(item);
};

export const getAssemblyMillItemByType = async (req: Request, res: Response) => {
    const { type } = req.params;
    const items = await AssemblyMillItemRecord.getAllByType(type as AssemblyMillItemType);
    res.status(200).send(items);
};