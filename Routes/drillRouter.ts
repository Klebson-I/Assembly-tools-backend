import {Request, Response, Router} from "express";
import {DrillRecord} from "../Records/DrillRecord";

export const drillRouter = Router();

drillRouter
    .get('/:id', async (req: Request, res: Response) => {
        const { id } = req.params;
        const item = await DrillRecord.getOne(id);
        res.status(200).send(item);
    })
    .get('', async (req: Request, res: Response) => {
        const items = await DrillRecord.getAll();
        res.status(200).send(items);
    })