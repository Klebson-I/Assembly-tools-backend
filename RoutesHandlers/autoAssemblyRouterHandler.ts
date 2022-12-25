import {Request, Response} from "express";
import {AutoAssemblyTool} from "../classes/AutoAssemblyTool";

export const autoSetToolsForDrilling = async (req: Request, res: Response) => {
    try {
        const {D, L} = req.params;
        const autoAssemblyTool = new AutoAssemblyTool({
            action: 'through hole',
            D: Number(D),
            L: Number(L),
        })
        const tool = await autoAssemblyTool.getToolForHole();
        res.status(200).send(tool);
    }
    catch (e) {
        res.status(200).send({
            msg: e.message,
        });
    }
}

export const autoSetToolsForCutting = async (req: Request, res: Response) => {
    try {
        const {L, D, L2, L3} = req.params;
        const autoAssemblyTool = new AutoAssemblyTool({
            action: 'cut bar',
            L: Number(L),
            D: Number(D),
            L2: Number(L2),
            L3: Number(L3),
        });
        const tool = await autoAssemblyTool.getToolForCutBar();
        res.status(200).send(tool);
    }
    catch (e) {
        res.status(200).send({
            msg: e.message,
        })
    }
};