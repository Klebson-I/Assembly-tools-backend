import {Request, Response} from "express";
import {createXMLFile} from "../functions/xmlFileGenerator";


export const createAndDownloadXML = async (req: Request, res: Response) => {
    try {
        const { id, isNullParamToReduce } = req.params;
        const filePath = await createXMLFile(id, Boolean(Number(isNullParamToReduce)));
        if (!filePath) {
            res.status(400).send('Error occurred during file creation');
        }
        res.download(filePath);
    }
    catch (e) {
        console.log(e);
    }
};