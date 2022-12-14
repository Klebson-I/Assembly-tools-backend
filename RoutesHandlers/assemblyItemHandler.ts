import {Request, Response} from "express";
import {AssemblyItemRecord} from "../Records/AssemblyItemRecord";

export const getAllAssemblyItems = async (req: Request, res: Response) => {
    const allAssemblyItems = await AssemblyItemRecord.getAll();
    res.status(200).send(allAssemblyItems);
};

export const getAllAssemblyItemsByMatch = async (req:Request, res: Response) => {
    const { match } = req.params;
    const allMatchingAssemblyItems = await AssemblyItemRecord.getAllByMatchingParams(match);
    res.status(200).send(allMatchingAssemblyItems);
};

export const getAssemblyItemById = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id)
    const item = await AssemblyItemRecord.getOne(id);
    if (item) {
        res.status(200).send(item);
        return;
    }
    res.status(205).send({msg: 'No tool found'});
}