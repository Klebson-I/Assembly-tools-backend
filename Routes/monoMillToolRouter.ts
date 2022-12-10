import {Request, Response, Router} from "express";
import {getSingleMonoMillTool} from "../RoutesHandlers/monoMillToolHandler";

export const monoMillToolRouter = Router();

monoMillToolRouter
    .get('/:id', async (req: Request, res: Response) => getSingleMonoMillTool(req, res))