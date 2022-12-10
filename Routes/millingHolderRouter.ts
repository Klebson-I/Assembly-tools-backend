import {Request, Response, Router} from "express";
import {getSingleMillHolder} from "../RoutesHandlers/millHolderHandler";

export const millingHolderRouter = Router();

millingHolderRouter
    .get('/:id', async (req: Request, res: Response) => getSingleMillHolder(req, res))