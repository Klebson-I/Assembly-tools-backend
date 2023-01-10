import {Request, Response, Router} from "express";
import {createAndDownloadXML} from "../RoutesHandlers/xmlHandler";

export const xmlRouter = Router();

xmlRouter
    .get('/:id/:isNullParamToReduce', async (req: Request, res: Response) => await createAndDownloadXML(req,res));
