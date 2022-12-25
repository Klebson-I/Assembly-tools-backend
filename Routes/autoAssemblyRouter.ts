import {Request, Response, Router} from "express";
import {autoSetToolsForCutting, autoSetToolsForDrilling} from "../RoutesHandlers/autoAssemblyRouterHandler";

export const autoAssemblyRouter = Router();

autoAssemblyRouter
    .get('/throughhole/:D/:L', async (req: Request, res: Response) => autoSetToolsForDrilling(req, res))
    .get('/no-throughhole/:D/:L',async (req: Request, res: Response) => autoSetToolsForDrilling(req, res))
    .get('/cutbar/:D/:L/:L2/:L3', async (req: Request, res: Response) => autoSetToolsForCutting(req,res))