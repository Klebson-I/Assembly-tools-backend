import {Request, Response, Router} from "express";
import {getAllMonoMillTools, getSingleMonoMillTool} from "../RoutesHandlers/monoMillToolHandler";

export const monoMillToolRouter = Router();

monoMillToolRouter
    .get('/', async (req: Request, res: Response) => getAllMonoMillTools(req, res))
    .get('/:id', async (req: Request, res: Response) => getSingleMonoMillTool(req, res))
