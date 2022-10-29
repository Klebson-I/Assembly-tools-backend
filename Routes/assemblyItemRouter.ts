import {Request, Response, Router} from "express";
import {
    getAllAssemblyItems,
    getAllAssemblyItemsByMatch,
    getAssemblyItemById
} from "../RoutesHandlers/assemblyItemHandler";

export const assemblyItemRouter = Router();

assemblyItemRouter
    .get('/',async (req: Request, res: Response) => await getAllAssemblyItems(req, res))
    .get('/:id', async (req: Request, res: Response) => await getAssemblyItemById(req,res))
    .get('/match/:match', async (req: Request, res: Response) => await getAllAssemblyItemsByMatch(req, res));