import {Request, Response, Router} from "express";
import {handleGetAllParams} from "../RoutesHandlers/paramsHandler";

export const paramsRouter = Router();

paramsRouter
    .get('/', (req: Request, res: Response) => handleGetAllParams(req, res));