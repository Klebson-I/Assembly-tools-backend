import {Request, Response} from "express";
import {TurningHolderRecord} from "../Records/TurningHolderRecord";

export const getAllTurningHoldersItems = async (req: Request, res: Response) => {
    const allTurningHolderItems = await TurningHolderRecord.getAll();
    res.status(200).send(allTurningHolderItems);
}

export const getAllTurningHoldersItemsByMatch = async (req: Request, res: Response) => {
    const { match } =req.params;
    const allMatchingTurningHolderItems = await TurningHolderRecord.getAllByMatchingParams(match);
    res.status(200).send(allMatchingTurningHolderItems);
}