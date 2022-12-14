import {CuttingInsertRecordType} from "./CuttingInsertRecord";
import {TurningHolderRecordType} from "./TurningHolderRecord";
import {AssemblyItemRecordType} from "./AssemblyItemRecord";
import {pool} from "../database";
import {v4 as uuid} from 'uuid';
import {MillingHolderRecordType} from "./MillingHolderRecord";
import {MonoMillingToolObject} from "./MonoMillingToolRecord";
import {CuttingInsertMillRecordType} from "./CuttingInsertMillRecord";
import {AssemblyMillItemRecordType} from "./AssemblyMillItemRecord";

const ASSEMBLY_ITEMS_KEYS = [
    'ISO50',
    'COLLET',
    'WEDGE_SCREW',
    'CLAMPING_WEDGE_MILL',
    'TORQUE_WRENCH',
    'KEY',
    'BIT',
    'INSERT_SCREW_MILL',
    'CASSETTE',
    'ASSEMBLY_ITEM',
];

const HOLD_PARTS_MILL_KEYS = [
    'DISC_CUTTER_HOLDER',
    'END_MILL_HOLDER',
    'END_MILL_MONO_HOLDER',
];

const CUT_PARTS_MILL_KEYS = [
    'INSERT_FOR_SLOT_CUT',
    'INSERT_FOR_MILL',
];

interface ToolObject {
    action: string;
    CUTTING_INSERT?: CuttingInsertRecordType,
    TURNING_HOLDER?: TurningHolderRecordType,
    ASSEMBLY_ITEM?: AssemblyItemRecordType,
    END_MILL_MONO_HOLDER?: MonoMillingToolObject,
    END_MILL_HOLDER?: MillingHolderRecordType,
    DISC_CUTTER_HOLDER?: MillingHolderRecordType,
    INSERT_FOR_SLOT_CUT?: CuttingInsertMillRecordType,
    INSERT_FOR_MILL?: CuttingInsertMillRecordType,
    CASSETTE?: AssemblyMillItemRecordType,
    INSERT_SCREW_MILL?: AssemblyMillItemRecordType,
    BIT?: AssemblyMillItemRecordType,
    KEY?: AssemblyMillItemRecordType,
    TORQUE_WRENCH?: AssemblyMillItemRecordType,
    CLAMPING_WEDGE_MILL?: AssemblyMillItemRecordType,
    WEDGE_SCREW?: AssemblyMillItemRecordType,
    COLLET?: AssemblyMillItemRecordType,
    ISO50?: AssemblyMillItemRecordType,
    name: string;
}

const putTurningAssemblyToolToDatabase = async (toolObject: ToolObject) : Promise<void> => {
    const newAssemblyToolId = uuid();
    const newCuttingInsertListId = uuid();
    const newTurningHolderListId = uuid();
    const newAssemblyItemListId = uuid();

    const listPromises =  [
        pool.execute('insert into `cutting_insert_list` values(:id, :assembly_id, :cutting_insert_id)',{
            id: newCuttingInsertListId,
            assembly_id: newAssemblyToolId,
            cutting_insert_id: toolObject.CUTTING_INSERT.id,
        }),
        pool.execute('insert into `turning_holder_list` values(:id, :assembly_id, :turning_holder_id)',{
            id: newTurningHolderListId,
            assembly_id: newAssemblyToolId,
            turning_holder_id: toolObject.TURNING_HOLDER.id,
        }),
        pool.execute('insert into `assembly_item_list` values(:id, :assembly_id, :assembly_item_id)',{
            id: newAssemblyItemListId,
            assembly_id: newAssemblyToolId,
            assembly_item_id: toolObject.ASSEMBLY_ITEM.id,
        }),
    ];

    await Promise.all(listPromises);

    await pool.execute('insert into `assembly_tool` values(:id, :type, :name)',{
        id: newAssemblyToolId,
        type: toolObject.action,
        name: toolObject.name,
    })
};

const createListOfPromisesForAssemblyItems = (toolsEntries: [keyof ToolObject, any][], toolId: string) => {
    const assemblyItems = toolsEntries.filter(([key, ]) => ASSEMBLY_ITEMS_KEYS.includes(key));
    return assemblyItems.map(
        ([,value]) => {
            const listId = uuid();
            return pool.execute('insert into `assembly_item_list` values(:id, :assembly_id, :assembly_item_id)',{
                id: listId,
                assembly_id: toolId,
                assembly_item_id: value.id,
            });
        }
    )
};

const createListOfPromisesForMillCutAndHoldParts = (toolsEntries: [keyof ToolObject, any][], toolId: string) => {
    const [, holdPart] = toolsEntries.find(([key, ]) => HOLD_PARTS_MILL_KEYS.includes(key));
    if (holdPart.type === 'END_MILL_MONO_HOLDER') {
        const listId = uuid();
        return [
            pool.execute('insert into `mill_holder_list` values(:id, :assembly_id, :mill_holder_id)',{
                id: listId,
                assembly_id: toolId,
                mill_holder_id: holdPart.id,
            })
        ]
    }
    const [, cutPart] = toolsEntries.find(([key, ]) => CUT_PARTS_MILL_KEYS.includes(key));
    const holderListId = uuid();
    const cuttingListId = uuid();

    return [
        pool.execute('insert into `mill_holder_list` values(:id, :assembly_id, :mill_holder_id)',{
            id: holderListId,
            assembly_id: toolId,
            mill_holder_id: holdPart.id,
        }),
        pool.execute('insert into `cutting_insert_list` values(:id, :assembly_id, :cutting_insert_id)',{
            id: cuttingListId,
            assembly_id: toolId,
            cutting_insert_id: cutPart.id,
        }),
    ]
};

const putMillingAssemblyToolToDatabase = async (toolObject: ToolObject) : Promise<void> => {
    const newAssemblyToolId = uuid();

    const selectedToolsEntries = Object.entries(toolObject)
        .filter(([, value]) => value.id && value.id !== 'OPTIONAL') as [keyof ToolObject, any][];

    const arrayOfPromisesForAssemblyItems = createListOfPromisesForAssemblyItems(selectedToolsEntries, newAssemblyToolId);

    const arrayOfPromisesForMillCutAndHoldParts = createListOfPromisesForMillCutAndHoldParts(selectedToolsEntries, newAssemblyToolId);

    const listPromises =  [
        ...arrayOfPromisesForMillCutAndHoldParts,
        ...arrayOfPromisesForAssemblyItems,
    ];

    await Promise.all(listPromises);

    await pool.execute('insert into `assembly_tool` values(:id, :type, :name)',{
        id: newAssemblyToolId,
        type: toolObject.action,
        name: toolObject.name,
    })
};

export const putAssemblyToolInDatabase = async (toolObject: ToolObject) => {
    if (toolObject.action === 'TURNING') {
        await putTurningAssemblyToolToDatabase(toolObject);
    }
    if (toolObject.action === 'MILLING') {
        await putMillingAssemblyToolToDatabase(toolObject);
    }
}

