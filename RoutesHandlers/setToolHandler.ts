import {Request, Response} from "express";
import {putAssemblyToolInDatabase} from "../Records/utils";
import {AssemblyToolRecord} from "../Records/AssemblyToolRecord";

export const setTool = async (req: Request, res: Response) => {
    try {
        const toolObject = req.body;
        await putAssemblyToolInDatabase(toolObject);
    }
    catch (e) {
        console.log(e);
    }
};

export const getAllUserAssemblyTools = async (req: Request, res: Response) => {
    try {
        const assemblyToolsForTurning = await AssemblyToolRecord.getAllAssemblyToolsForTurning();
        res.status(200).send(assemblyToolsForTurning);
    }
    catch (e) {
        console.log(e);
    }
}

export const deleteAssemblyTool = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error('No id found');
        }
        const assemblyTool = await AssemblyToolRecord.getOne(id);
        console.log(assemblyTool);
        const res = await assemblyTool.delete();
        console.log(res);
    }
    catch (e) {
        console.log(e);
    }
};