import {AssemblyToolRecord} from "../Records/AssemblyToolRecord";
import {TurningHolderRecord} from "../Records/TurningHolderRecord";
import {CuttingInsertRecord} from "../Records/CuttingInsertRecord";
import {AssemblyItemRecord} from "../Records/AssemblyItemRecord";
import { writeFile } from 'fs/promises';
import {join} from "path";
import {v4} from 'uuid';
import {
    getDrillingAssemblyTools, GetDrillingReturn,
    getMillingAssemblyTools,
    GetMillingReturn,
    getTurningAssemblyTools,
    GetTurningReturn
} from "./getTurningAssemblyTools";
import {MonoMillPropertyType} from "../Records/MonoMillingToolRecord";
import {MillingHolderPropertyType} from "../Records/MillingHolderRecord";
import {CuttingInsertMillRecordType} from "../Records/CuttingInsertMillRecord";
import {AssemblyMillItemPropertyType} from "../Records/AssemblyMillItemRecord";

type anyItemType = TurningHolderRecord| CuttingInsertRecord | AssemblyItemRecord |
    MillingHolderPropertyType | MonoMillPropertyType | CuttingInsertMillRecordType |
    AssemblyMillItemPropertyType;

const ARRAY_OF_WEAR_KEYS = [
    'CUTTING_INSERT',
    'INSERT_FOR_SLOT_CUT',
    'INSERT_FOR_MILL',
    'END_MILL_MONO_HOLDER',
];

const OPTIONAL_KEYS = [
    'COLLET',
    'ISO50',
    'TORQUE_WRENCH',
];

const KEYS_FOR_QUANTITY_EVALUATION = [
    'CASSETTE',
    'CLAMPING_WEDGE_MILL',
    'WEDGE_SCREW',
    'INSERT_SCREW_MILL',
];

const OPTIONAL_CHAR = 'O';

const REQUIRED_CHAR = 'R';

const WEAR_CHAR = 'W';

const INSERT_CHAR = 'I';

const BODY_CHAR = 'B';

const SPAREPART_CHAR = 'S';

const FIXED_PART_CHAR = 'F';

const ACCESSORY_CHAR = 'A';

const XMLTAGS = {
    XML_HEADER: '<?xml version="1.0" encoding="UTF-8" ?>',
    TOOL_DATA_TAG: '<Tool_Data>',
    ADMIN_DATA_TAG: '<Admin-Data>',
    DATE_TAG: '<DATE Desc_EN="Document creation date" Format="YYYY-MM-DD">',
    TOOL_TAG: '<Tool>',
    MAIN_DATA_TAG: '<Main-Data>',
    MAIN_DATA_MANUFACTURER_PARAM: '<id10000 Desc_EN="Manufacturer">',
    MAIN_DATA_DRAWING_FILE_PARAM: '<id10002 Desc_EN="Drawing file">',
    DRAWING_DATA_TAG: '<Drawing-data>',
    DRAWING_DATA_MANUFACTURER_DRAW_NUMBER_PARAM: '<id12000 Desc_EN="Manufacturer\'s drawing number">',
    DRAWING_DATA_DRAW_DESCRIPTION_PARAM: '<id12001 multilang="true" Desc_EN="Drawing description 1">',
    DRAWING_DATA_DRAW_FORMAT_PARAM: '<id12005 Desc_EN="Drawing format">',
    DRAWING_DATA_DRAW_SCALE_PARAM: '<id12006 Desc_EN="Drawing Scale">',
    DRAWING_DATA_DRAW_UNIT_PARAM: '<id12007 Desc_EN="Drawing unit base">',
    DRAWING_DATA_DESIGN_DATE_PARAM: '<id12008 Desc_EN="Drawing design date" Format="YYYY-MM-DD">',
    DRAWING_DATA_DESIGNER_PARAM: '<id12009 Desc_EN="Drawing designer name">',
    TEXT_TAG: '<Text lang="en">',
    REVISION_DATA_TAG: '<Revision-Data />',
    ITEM_DATA_TAG: '<Item-data>',
    ITEM_DATA_ITEM_ID_PARAM: '<id13000 Desc_EN="Item ID">',
    ITEM_DATA_ITEM_NAME_PARAM: '<id13001 Desc_EN="Item name">',
    ITEM_DATA_ITEM_DESCRIPTION: '<id13002 Desc_EN="Item description">',
    CUSTOMER_BLOCK_TAG: '<Customer-Block>',
    CUSTOMER_DATA_TAG: '<Customer-Data />',
    PROCESS_DATA_TAG: '<Process-Data />',
    SPAREPART_DATA_TAG: '<Sparepart-Data>',
    BOM_TAG: '<BOM>',
    BOM_POSITION_PARAM: '<id31000 Desc_EN="BOMitem position">',
    BOM_ITEM_PIECES_PARAM: '<id31001 Desc_EN="BOMitem pieces">',
    BOM_ITEM_DESCRIPTION_PARAM: '<id31002 multilang="true" Desc_EN="BOM item description">',
    BOM_ITEM_MATERIAL_PARAM: '<id31003 Desc_EN="BOMitem material">',
    BOM_ITEM_NAME_PARAM: '<id31004 Desc_EN="BOMitem name">',
    BOM_ITEM_KIND_PARAM: '<id31007 Desc_EN="BOMitem kind">',
    BOM_ITEM_ATTRIBUTE_PARAM: '<id31008 Desc_EN="BOMitem attribute">',
    BOM_ITEM_INCLUDED_PARAM: '<id31009 Desc_EN="BOMitem included">',
    BOM_ITEM_ID_PARAM: '<id31011 Desc_EN="BOMitem id">',
    BOM_ITEM_NOTE_PARAM: '<id31012 Desc_EN="BOMitem note">',
    TOOL_SPECIFIC_TAG: '<TOOL_PARAMS>',
};

const getCloseTag = (tag: string) : string => {
    if (tag.slice(2).includes('/')) {
        return '';
    }
    const splitTag = tag.split(' ');
    if (splitTag.length === 1) {
        return splitTag[0].replace('<','</');
    }
    return splitTag[0].replace('<','</') + '>';
};

const getBomItemKind = (item: anyItemType) : string =>
    ARRAY_OF_WEAR_KEYS.includes(item.type) ? WEAR_CHAR : " ";

const getIncludedParam = (item: anyItemType) : string =>
    OPTIONAL_KEYS.includes(item.type) ? OPTIONAL_CHAR : REQUIRED_CHAR;

const getBomItemAttribute = (item: anyItemType) : string => {
    switch (item.type) {
        case 'CUTTING_INSERT': return INSERT_CHAR;
        case 'INSERT_FOR_SLOT_CUT': return INSERT_CHAR;
        case 'INSERT_FOR_MILL': return INSERT_CHAR;
        case 'TURNING_HOLDER': return BODY_CHAR;
        case 'DISC_CUTTER_HOLDER': return BODY_CHAR;
        case 'END_MILL_MONO_HOLDER': return FIXED_PART_CHAR;
        case 'DRILL': return FIXED_PART_CHAR;
        case 'ANGLE_CUTTER': return FIXED_PART_CHAR;
        case 'END_MILL_HOLDER': return BODY_CHAR;
        case 'ASSEMBLY_ITEM': return SPAREPART_CHAR;
        case 'ISO50': return SPAREPART_CHAR;
        case 'COLLET': return SPAREPART_CHAR;
        case 'CASSETTE': return SPAREPART_CHAR;
        case 'TORQUE_WRENCH': return ACCESSORY_CHAR;
        case 'KEY': return ACCESSORY_CHAR;
        case 'BIT': return SPAREPART_CHAR;
        case 'WEDGE_SCREW': return SPAREPART_CHAR;
        case 'CLAMPING_WEDGE_MILL': return SPAREPART_CHAR;
        case 'INSERT_SCREW_MILL': return SPAREPART_CHAR;
    }
};

const getItemQuantityAttribute = (item: anyItemType, items: anyItemType[]) => {
    if (!KEYS_FOR_QUANTITY_EVALUATION.includes(item.type)) {
        return 1;
    }
    const { CICTTOT }: any = items.find((elem: MillingHolderPropertyType) => elem.CICTTOT)
    return CICTTOT;
};

const getBomNoteParam = ({type}: anyItemType) => {
    if (type === 'ISO50') {
        return 'Use only with CNC machine';
    }
    if (type === 'COLLET') {
        return 'Use only with ISO50';
    }
    return "";
};

const getDateInProperFormat = () : string => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const filterToolParams = (value: any, isNullParamToReduce: boolean) : boolean => {
    if (isNullParamToReduce) {
        return value !== null;
    }
    return true;
}

const getToolParamsXMLTag = (toolsList: anyItemType[], isNullParamToReduce: boolean) : string => {

    let toolsParamsStr = '';

    toolsParamsStr+= XMLTAGS.TOOL_SPECIFIC_TAG;

    const toolsParamsForEachParts = toolsList.map((tool) => {
        let singleToolString = '';
        singleToolString+=`<${tool.type}>\n`;
        const paramsTagsStrings =
            Object
                .entries(tool)
                .filter(([,value]) => filterToolParams(value, isNullParamToReduce))
                .map(([name, value]) => `<parameter name="${name}">${value}</parameter> \n`)
                .reduce((prev, curr) => prev + curr);
        singleToolString+=paramsTagsStrings;
        return singleToolString + `</${tool.type}>\n`;
        })
        .reduce((prev, curr) => prev + curr);

    toolsParamsStr+= toolsParamsForEachParts;
    toolsParamsStr+= getCloseTag(XMLTAGS.TOOL_SPECIFIC_TAG) + '\n';
    return toolsParamsStr;
};


const getItemsForXMLFile = async (id: string) : Promise<GetTurningReturn|GetMillingReturn|GetDrillingReturn> => {
    const {type} = await AssemblyToolRecord.getOne(id);
    if (type === 'MILLING') {
        return await getMillingAssemblyTools(id);
    }
    if (type === 'TURNING') {
        return await getTurningAssemblyTools(id);
    }
    if (type === 'DRILLING') {
        return await getDrillingAssemblyTools(id);
    }
};

export const createXMLFile = async (id: string, isNullParamToReduce: boolean) : Promise<string> => {
    const assemblyToolRecord = await AssemblyToolRecord.getOne(id);

    const items = await getItemsForXMLFile(id);

    const itemsObjects = Object.values(items);

    if (!itemsObjects) {
        return '';
    }

    let xmlFileText = '';

    xmlFileText+=XMLTAGS.XML_HEADER + '\n';
    xmlFileText+=XMLTAGS.TOOL_DATA_TAG + '\n';

    xmlFileText+=XMLTAGS.ADMIN_DATA_TAG + '\n';
    xmlFileText+= XMLTAGS.DATE_TAG + getDateInProperFormat() + getCloseTag(XMLTAGS.DATE_TAG) + '\n';
    xmlFileText+= getCloseTag(XMLTAGS.ADMIN_DATA_TAG) + '\n';

    xmlFileText+= XMLTAGS.TOOL_TAG + '\n';
    xmlFileText+= XMLTAGS.MAIN_DATA_TAG + '\n';

    xmlFileText+= XMLTAGS.MAIN_DATA_MANUFACTURER_PARAM + 'SANDVICK COROMANT' + getCloseTag(XMLTAGS.MAIN_DATA_MANUFACTURER_PARAM) + '\n';
    xmlFileText+= XMLTAGS.MAIN_DATA_DRAWING_FILE_PARAM + 'draw.jpg' + getCloseTag(XMLTAGS.MAIN_DATA_DRAWING_FILE_PARAM) + '\n';

    // DRAWING DATA

    xmlFileText+= XMLTAGS.DRAWING_DATA_TAG + '\n';
    xmlFileText+= XMLTAGS.DRAWING_DATA_MANUFACTURER_DRAW_NUMBER_PARAM + '123456789' + getCloseTag(XMLTAGS.DRAWING_DATA_MANUFACTURER_DRAW_NUMBER_PARAM )+'\n'; // add this to db (draw number)
    xmlFileText+= XMLTAGS.DRAWING_DATA_DRAW_DESCRIPTION_PARAM + assemblyToolRecord.type + getCloseTag(XMLTAGS.DRAWING_DATA_DRAW_DESCRIPTION_PARAM )+'\n';
    xmlFileText+= XMLTAGS.DRAWING_DATA_DRAW_FORMAT_PARAM + 'A3' + getCloseTag(XMLTAGS.DRAWING_DATA_DRAW_FORMAT_PARAM )+'\n';
    xmlFileText+= XMLTAGS.DRAWING_DATA_DRAW_SCALE_PARAM + '1:1' + getCloseTag(XMLTAGS.DRAWING_DATA_DRAW_SCALE_PARAM )+'\n';
    xmlFileText+= XMLTAGS.DRAWING_DATA_DRAW_UNIT_PARAM + 'mm' + getCloseTag(XMLTAGS.DRAWING_DATA_DRAW_UNIT_PARAM )+'\n';
    xmlFileText+= XMLTAGS.DRAWING_DATA_DESIGN_DATE_PARAM + '2022-11-20' + getCloseTag(XMLTAGS.DRAWING_DATA_DESIGN_DATE_PARAM )+'\n';
    xmlFileText+= XMLTAGS.DRAWING_DATA_DESIGNER_PARAM + 'LUKASZ' + getCloseTag(XMLTAGS.DRAWING_DATA_DESIGNER_PARAM )+'\n';
    xmlFileText+=XMLTAGS.REVISION_DATA_TAG + '\n';
    xmlFileText+= getCloseTag(XMLTAGS.DRAWING_DATA_TAG) + '\n';

    //ITEM DATA complete

    xmlFileText+= XMLTAGS.ITEM_DATA_TAG + '\n';
    xmlFileText+= XMLTAGS.ITEM_DATA_ITEM_ID_PARAM + assemblyToolRecord.id + getCloseTag(XMLTAGS.ITEM_DATA_ITEM_ID_PARAM) + '\n';
    xmlFileText+= XMLTAGS.ITEM_DATA_ITEM_NAME_PARAM + assemblyToolRecord.name + getCloseTag(XMLTAGS.ITEM_DATA_ITEM_NAME_PARAM) + '\n';
    xmlFileText+= XMLTAGS.ITEM_DATA_ITEM_DESCRIPTION + 'Description' + getCloseTag(XMLTAGS.ITEM_DATA_ITEM_DESCRIPTION) + '\n';
    xmlFileText+= getCloseTag(XMLTAGS.ITEM_DATA_TAG) + '\n';

    xmlFileText+= getCloseTag(XMLTAGS.MAIN_DATA_TAG) + '\n';

    // CUSTOMER BLOCK complete

    xmlFileText+= XMLTAGS.CUSTOMER_BLOCK_TAG + '\n';
    xmlFileText+= XMLTAGS.CUSTOMER_DATA_TAG + '\n';
    xmlFileText+= XMLTAGS.PROCESS_DATA_TAG + '\n';
    xmlFileText+= getCloseTag(XMLTAGS.CUSTOMER_BLOCK_TAG) + '\n';

    // SEPARATE DATA

    xmlFileText+= XMLTAGS.SPAREPART_DATA_TAG + '\n';

    for (const item of itemsObjects) {
        xmlFileText+= XMLTAGS.BOM_TAG + '\n';
        xmlFileText+= XMLTAGS.BOM_POSITION_PARAM + `${itemsObjects.indexOf(item) + 1}` + getCloseTag(XMLTAGS.BOM_POSITION_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_PIECES_PARAM + getItemQuantityAttribute(item, itemsObjects) + getCloseTag(XMLTAGS.BOM_ITEM_PIECES_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_DESCRIPTION_PARAM + 'Description' + getCloseTag(XMLTAGS.BOM_ITEM_DESCRIPTION_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_MATERIAL_PARAM + '' + getCloseTag(XMLTAGS.BOM_ITEM_MATERIAL_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_NAME_PARAM + item.name + getCloseTag(XMLTAGS.BOM_ITEM_NAME_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_KIND_PARAM + getBomItemKind(item) + getCloseTag(XMLTAGS.BOM_ITEM_KIND_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_ATTRIBUTE_PARAM + getBomItemAttribute(item) + getCloseTag(XMLTAGS.BOM_ITEM_ATTRIBUTE_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_INCLUDED_PARAM + getIncludedParam(item) + getCloseTag(XMLTAGS.BOM_ITEM_INCLUDED_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_ID_PARAM + item.id + getCloseTag(XMLTAGS.BOM_ITEM_ID_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_NOTE_PARAM + getBomNoteParam(item) + getCloseTag(XMLTAGS.BOM_ITEM_NOTE_PARAM) + '\n';
        xmlFileText+= getCloseTag(XMLTAGS.BOM_TAG) + '\n';
    }

    xmlFileText+= getCloseTag(XMLTAGS.SPAREPART_DATA_TAG) + '\n';
    xmlFileText+= getCloseTag(XMLTAGS.TOOL_TAG) + '\n';


    xmlFileText+=getToolParamsXMLTag(itemsObjects, isNullParamToReduce);

    xmlFileText+= getCloseTag(XMLTAGS.TOOL_DATA_TAG) + '\n';

    const filePath = join(__dirname,`../xml/tool_${assemblyToolRecord.id}--${v4()}.xml`);

    await writeFile(filePath, xmlFileText);

    return filePath;
};