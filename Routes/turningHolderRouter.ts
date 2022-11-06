import {Request, Response, Router} from "express";
import {
    getAllTurningHoldersItems, getAllTurningHoldersItemsByInsert,
    getTurningHolderById
} from "../RoutesHandlers/turningHolderHandler";

export const turningHolderRouter = Router();

turningHolderRouter
    .get('/',async (req: Request, res: Response) => await getAllTurningHoldersItems(req, res))
    .get('/:id', async (req: Request, res: Response) => await getTurningHolderById(req,res))
    .get('/:shape/:size', async (req: Request, res: Response) => await getAllTurningHoldersItemsByInsert(req, res));