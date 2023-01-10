import {Response} from "express";
import {join} from "path";


export const getParamsFile = async (res: Response) => {
    const filePath = join(__dirname,`../download/params.csv`);
    if (!filePath) {
        res.status(400).send('Error occurred during file creation');
    }
    res.download(filePath);
};