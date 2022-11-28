import {Request, Response, Router} from "express";
import {
    getAllCuttingInsertItems, getAllCuttingInsertsByHolder,
    getCuttingInsertById
} from "../RoutesHandlers/cuttingInsertHandler";

export const cuttingInsertRouter = Router();

cuttingInsertRouter
    .get('/',async (req: Request, res: Response) => await getAllCuttingInsertItems(req, res))
    .get('/:id', async (req: Request, res: Response) => await getCuttingInsertById(req,res))
    .get('/:shape/:size', async (req: Request, res: Response) => await getAllCuttingInsertsByHolder(req, res));