import {Request, Response, Router} from "express";
import {getAllMillsHoldersAndMonoTools, getSingleMillHolder} from "../RoutesHandlers/millHolderHandler";

export const millingHolderRouter = Router();

millingHolderRouter
    .get('/allMills', async (req, res) => getAllMillsHoldersAndMonoTools(req, res))
    .get('/:id', async (req: Request, res: Response) => getSingleMillHolder(req, res))