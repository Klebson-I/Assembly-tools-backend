import {Request, Response, Router} from 'express';
import {getAllItems} from "../RoutesHandlers/allItemsHandler";

export const allItemsRouter = Router();

allItemsRouter
    .get('/',async (req:Request, res: Response) => await getAllItems(req, res));