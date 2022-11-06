import {Request, Response, Router} from "express";
import {deleteAssemblyTool, getAllUserAssemblyTools, setTool} from "../RoutesHandlers/setToolHandler";

export const setToolRouter = Router();

setToolRouter
    .post('/',async (req: Request, res: Response) => await setTool(req, res))
    .get('/', async (req: Request, res: Response) => await getAllUserAssemblyTools(req, res))
    .delete('/:id', async (req: Request, res: Response) => await deleteAssemblyTool(req, res));