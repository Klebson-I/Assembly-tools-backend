import {Request, Response} from "express";
import {AutoAssemblyTool} from "../classes/AutoAssemblyTool";

export const autoSetToolsForNoThroughDrilling = async (req: Request, res: Response) => {
    try {
        const {D, L, IT, BOTTOM} = req.params;
        const autoAssemblyTool = new AutoAssemblyTool({
            action: 'through hole',
            D: Number(D),
            L: Number(L),
            IT,
            BOTTOM,
        })
        const drills = await autoAssemblyTool.getToolForHole();

        let responseObject : any = drills
            .sort((a,b) => {
                if (a.DC > b.DC) return 1;
                if (a.DC < b.DC) return -1;
                return 0;
            })
            .reduce((acc, curr) => {
            const index = Object.keys(acc).length + 1;
            const fieldName = `DRILLING - ${index}`;
            return {
                ...acc,
                [`${fieldName}`]: [curr],
            }
        },{});

        if (BOTTOM === 'FLAT') {
            const millForHole = await autoAssemblyTool.getProperMillToolForHole();
            responseObject = {
                ...responseObject,
                MILLING: millForHole,
            }
        }

        res.status(200).send(responseObject);
    }
    catch (e) {
        res.status(200).send({
            msg: e.message,
        });
    }
}

export const autoSetToolsForThroughDrilling = async (req: Request, res: Response) => {
    try {
        const {D, L, IT} = req.params;
        const autoAssemblyTool = new AutoAssemblyTool({
            action: 'through hole',
            D: Number(D),
            L: Number(L),
            IT,
        })

        const drills = await autoAssemblyTool.getToolForHole();

        let responseObject : any = drills
            .sort((a,b) => {
                if (a.DC > b.DC) return 1;
                if (a.DC < b.DC) return -1;
                return 0;
            })
            .reduce((acc, curr) => {
                const index = Object.keys(acc).length + 1;
                const fieldName = `DRILLING - ${index}`;
                return {
                    ...acc,
                    [`${fieldName}`]: [curr],
                }
            },{});

        res.status(200).send(responseObject);
    }
    catch (e) {
        res.status(200).send({
            msg: e.message,
        });
    }
};

export const autoSetToolsForCutting = async (req: Request, res: Response) => {
    try {
        const {D} = req.params;
        const autoAssemblyTool = new AutoAssemblyTool({
            action: 'cut bar',
            D: Number(D),
        });
        const tool = await autoAssemblyTool.getToolForCutBar();

        const responseObject = {
            MILLING: tool,
        };

        res.status(200).send(responseObject);
    }
    catch (e) {
        res.status(200).send({
            msg: e.message,
        })
    }
};

export const autoSetToolForSideSlot = async (req: Request, res: Response) => {
    try {
        const {L, L2, H} = req.params;
        const autoAssemblyTool = new AutoAssemblyTool({
            action: 'side slot',
            L: Number(L),
            L2: Number(L2),
            H: Number(H),
        })
        const tool = await autoAssemblyTool.getToolForSideSlot();

        const responseObject = {
            MILLING: tool,
        };

        res.status(200).send(responseObject);
    }
    catch (e) {
        res.status(200).send({
            msg: e.message,
        });
    }
};

export const autoSetToolForSurfacePlanning = async (req: Request, res: Response) => {
    try {
        const {H, L, L2} = req.params;
        const autoAssemblyTool = new AutoAssemblyTool({
            action: 'side slot',
            L: Number(L),
            L2: Number(L2),
            H: Number(H),
        })
        const roughingTool = await autoAssemblyTool.getToolForRoughSurfacePlanning();
        const finishingTool = await autoAssemblyTool.getToolForFinishSurfacePlanning();

        const responseObject = {
            MILLING_ROUGH: roughingTool,
            MILLING_FINISH: finishingTool,
        };

        res.status(200).send(responseObject);
    }
    catch (e) {
        res.status(200).send({
            msg: e.message,
        })
    }
};

export const autoSetToolForPocket = async (req: Request, res: Response) => {
    try {
        const {L, L2, AP, R} = req.params;
        const autoAssemblyTool = new AutoAssemblyTool({
            action: 'pocket',
            L: Number(L),
            L2: Number(L2),
            AP: Number(AP),
            R: Number(R),
        });
        const roughingTool = await autoAssemblyTool.getRoughToolForPocket();
        const finishingTool = await autoAssemblyTool.getFinishingToolForPocket();

        const responseObject = {
            MILLING_ROUGH: roughingTool,
            MILLING_FINISH: finishingTool,
        };

        res.status(200).send(responseObject);
    }
    catch (e) {
        res.status(200).send({
            msg: e.message,
        })
    }
};

