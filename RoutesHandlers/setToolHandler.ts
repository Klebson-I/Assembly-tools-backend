import {Request, Response} from "express";
import {putAssemblyToolInDatabase} from "../Records/utils";
import {AssemblyToolRecord} from "../Records/AssemblyToolRecord";

export const setTool = async (req: Request, res: Response) => {
    try {
        const toolObject = req.body;
        await putAssemblyToolInDatabase(toolObject);
        res.status(200).send({msg: 'Tool saved in database'})
    }
    catch (e) {
        res.status(200).send({msg: 'Error occured during saving tool'})
    }
};

export const getAllUserAssemblyTools = async (req: Request, res: Response) => {
    try {
        const assemblyToolsForTurning = await AssemblyToolRecord.getAllAssemblyToolsForTurning();
        res.status(200).send({msg: 'Assembly tools correctly loaded', payload: assemblyToolsForTurning});
    }
    catch (e) {
        res.status(400).send({msg: 'Cannot load assembly tools'});
    }
}

export const deleteAssemblyTool = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error('No id found');
        }

        const assemblyTool = await AssemblyToolRecord.getOne(id);

        await assemblyTool.delete();

        res.status(200).send({
            msg: 'Tool correctly deleted',
        })

    }
    catch (e) {
        res.status(400).send({
            msg: 'Cannot delete this tool !',
        })
    }
};