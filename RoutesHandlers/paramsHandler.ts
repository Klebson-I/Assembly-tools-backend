import {Request, Response} from "express";
import {getParamsData} from "../functions/getParamsData";

export const handleGetAllParams = async (req: Request, res: Response) : Promise<void> => {
    try {
        const params = await getParamsData();
        res.status(200).send(params);
    }
    catch (e) {
        console.log(e);
    }
};