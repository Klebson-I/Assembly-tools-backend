import {Request, Response, Router} from "express";
import {getAssemblyMillItemByType, getSingleAssemblyMillItem} from "../RoutesHandlers/assemblyMillItemHandlers";

export const assemblyMillItemRouter = Router();

assemblyMillItemRouter
    .get('/:id', async (req: Request, res: Response) => getSingleAssemblyMillItem(req, res))
    .get('/type/:type', async (req: Request, res: Response) => getAssemblyMillItemByType(req, res))