import {Request, Response, Router} from "express";
import {
    getAllMonoMillSlotTools,
    getAllMonoMillTools,
    getSingleMonoMillTool
} from "../RoutesHandlers/monoMillToolHandler";

export const monoMillToolRouter = Router();

monoMillToolRouter
    .get('/END_MILL_MONO_HOLDER', async (req: Request, res: Response) => getAllMonoMillTools(req, res))
    .get('/ANGLE_CUTTER', async (req: Request, res: Response) => getAllMonoMillSlotTools(req, res))
    .get('/:id', async (req: Request, res: Response) => getSingleMonoMillTool(req, res))
