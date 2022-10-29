import {Request, Response, Router} from "express";
import {
    getAllTurningHoldersItems,
    getAllTurningHoldersItemsByMatch,
    getTurningHolderById
} from "../RoutesHandlers/turningHolderHandler";

export const turningHolderRouter = Router();

turningHolderRouter
    .get('/',async (req: Request, res: Response) => await getAllTurningHoldersItems(req, res))
    .get('/:id', async (req: Request, res: Response) => await getTurningHolderById(req,res))
    .get('/match/:match', async (req: Request, res: Response) => await getAllTurningHoldersItemsByMatch(req, res));