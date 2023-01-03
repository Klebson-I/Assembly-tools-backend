import {Request, Response, Router} from "express";
import {
    autoSetToolForPocket,
    autoSetToolForSideSlot, autoSetToolForSurfacePlanning, autoSetToolForVSlot,
    autoSetToolsForCutting, autoSetToolsForNoThroughDrilling, autoSetToolsForThroughDrilling
} from "../RoutesHandlers/autoAssemblyRouterHandler";

export const autoAssemblyRouter = Router();

autoAssemblyRouter
    .get('/throughhole/:D/:L/:IT', async (req: Request, res: Response) => autoSetToolsForThroughDrilling(req, res))
    .get('/no-throughhole/:D/:L/:IT/:BOTTOM',async (req: Request, res: Response) => autoSetToolsForNoThroughDrilling(req, res))
    .get('/cutbar/:D', async (req: Request, res: Response) => autoSetToolsForCutting(req,res))
    .get('/sideslot/:L/:L2/:H', async (req: Request, res: Response) => autoSetToolForSideSlot(req, res))
    .get('/surfaceplanning/:L/:L2/:H', async (req: Request, res: Response) => autoSetToolForSurfacePlanning(req,res))
    .get('/pocket/:L/:L2/:R/:AP', async (req: Request, res: Response) => autoSetToolForPocket(req,res))
    .get('/openpocket/:L/:L2/:R/:AP', async (req: Request, res: Response) => autoSetToolForPocket(req, res))
    .get('/Vslot/:deg/:L/:H', async (req: Request, res: Response) => autoSetToolForVSlot(req, res))