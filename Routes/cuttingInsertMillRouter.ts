import { Request, Response, Router} from "express";
import {getSingleCuttingInsertMill} from "../RoutesHandlers/cuttingInsertMillHandler";

export const cuttingInsertMillRouter = Router();

cuttingInsertMillRouter
    .get('/:id', async (req: Request, res: Response) => getSingleCuttingInsertMill(req, res))