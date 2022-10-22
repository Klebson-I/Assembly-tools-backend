import {Request, Response, Router} from "express";
import {getAllCuttingInsertItems, getAllCuttingInsertItemsByMatch} from "../RoutesHandlers/cuttingInsertHandler";

export const cuttingInsertRouter = Router();

cuttingInsertRouter
    .get('/',async (req: Request, res: Response) => await getAllCuttingInsertItems(req, res))
    .get('/match/:match', async (req: Request, res: Response) => await getAllCuttingInsertItemsByMatch(req, res));