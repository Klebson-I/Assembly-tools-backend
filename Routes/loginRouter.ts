import {Request, Response, Router} from "express";
import {logInAdmin} from "../RoutesHandlers/userHandler";

export const loginRouter = Router();

loginRouter
    .post('/',async (req: Request, res: Response) => await logInAdmin(req, res));