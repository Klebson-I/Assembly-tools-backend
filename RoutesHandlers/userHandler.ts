import {Request, Response} from "express";
import {AdminRecord} from "../Records/AdminRecord";

export const logInAdmin = async (req: Request, res: Response) => {
    const {login, password} = req.body;
    if (login === '' || password === '') {
        res.status(400).send({
            msg: 'Empty strings',
        });
        return;
    }
    const doesAdminExist = await AdminRecord.arePassesCorrect(login, password);
    res.send({
        isCorrect: doesAdminExist,
    });
}