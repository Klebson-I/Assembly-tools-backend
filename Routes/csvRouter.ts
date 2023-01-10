import {Request, Response, Router} from "express";
import {getParamsFile} from "../RoutesHandlers/csvRouterHandler";

export const csvRouter = Router();

csvRouter
    .get('/', async (req: Request, res: Response) => getParamsFile(res));