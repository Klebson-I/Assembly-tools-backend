import { Request, Response, Router} from "express";
import {
    getCuttingInsertMillByShapeAndSize,
    getSingleCuttingInsertMill
} from "../RoutesHandlers/cuttingInsertMillHandler";

export const cuttingInsertMillRouter = Router();

cuttingInsertMillRouter
    .get('/:id', async (req: Request, res: Response) => getSingleCuttingInsertMill(req, res))
    .get('/:type/:shape/:size', async (req: Request, res: Response) =>
        getCuttingInsertMillByShapeAndSize(req, res))