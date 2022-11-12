import {AssemblyToolRecord} from "../Records/AssemblyToolRecord";
import {pool} from "../database";
import {TurningHolderRecord} from "../Records/TurningHolderRecord";
import {CuttingInsertRecord} from "../Records/CuttingInsertRecord";
import {AssemblyItemRecord} from "../Records/AssemblyItemRecord";
import { writeFile } from 'fs/promises';
import {join} from "path";
import {v4} from 'uuid';

const XMLTAGS = {
    XML_HEADER: '<?xml version="1.0" encoding="UTF-8" ?>',
    TOOL_DATA_TAG: '<Tool_Data>',
    ADMIN_DATA_TAG: '<Admin-Data>',
    DATE_TAG: '<DATE Desc_EN="Document creation date" Format="YYYY-MM-DD">', // get date from system
    TOOL_TAG: '<Tool>',
    MAIN_DATA_TAG: '<Main-Data>',
    MAIN_DATA_MANUFACTURER_PARAM: '<id10000 Desc_EN="Manufacturer">', // sandvick ?
    MAIN_DATA_DRAWING_FILE_PARAM: '<id10002 Desc_EN="Drawing file">', //file name
    DRAWING_DATA_TAG: '<Drawing-data>',
    DRAWING_DATA_MANUFACTURER_DRAW_NUMBER_PARAM: '<id12000 Desc_EN="Manufacturer\'s drawing number">', //create draw number
    DRAWING_DATA_DRAW_DESCRIPTION_PARAM: '<id12001 multilang="true" Desc_EN="Drawing description 1">', // turning holder/ cutting insert a.s.o
    DRAWING_DATA_DRAW_FORMAT_PARAM: '<id12005 Desc_EN="Drawing format">', //A3
    DRAWING_DATA_DRAW_SCALE_PARAM: '<id12006 Desc_EN="Drawing Scale">', // 1:1?
    DRAWING_DATA_DRAW_UNIT_PARAM: '<id12007 Desc_EN="Drawing unit base">', // mm
    DRAWING_DATA_DESIGN_DATE_PARAM: '<id12008 Desc_EN="Drawing design date" Format="YYYY-MM-DD">', // date
    DRAWING_DATA_DESIGNER_PARAM: '<id12009 Desc_EN="Drawing designer name">', // Lukasz if i draw it
    TEXT_TAG: '<Text lang="en">',
    REVISION_DATA_TAG: '<Revision-Data />',
    ITEM_DATA_TAG: '<Item-data>',
    ITEM_DATA_ITEM_ID_PARAM: '<id13000 Desc_EN="Item ID">', //id from db assemlby_tool.id
    ITEM_DATA_ITEM_NAME_PARAM: '<id13001 Desc_EN="Item name">', // name from assembly_tool db
    ITEM_DATA_ITEM_DESCRIPTION: '<id13002 Desc_EN="Item description">', // type from assembly_tool ?
    CUSTOMER_BLOCK_TAG: '<Customer-Block>',
    CUSTOMER_DATA_TAG: '<Customer-Data />',
    PROCESS_DATA_TAG: '<Process-Data />',
    SPAREPART_DATA_TAG: '<Sparepart-Data>',
    BOM_TAG: '<BOM>',
    BOM_POSITION_PARAM: '<id31000 Desc_EN="BOMitem position">', // increment depend on items quantity
    BOM_ITEM_PIECES_PARAM: '<id31001 Desc_EN="BOMitem pieces">', // how much pieces? add this to db lists tables
    BOM_ITEM_DESCRIPTION_PARAM: '<id31002 multilang="true" Desc_EN="BOM item description">', // item description, make a const with descriptions
    BOM_ITEM_MATERIAL_PARAM: '<id31003 Desc_EN="BOMitem material">', // material from item db
    BOM_ITEM_NAME_PARAM: '<id31004 Desc_EN="BOMitem name">', // name of item from db item
    BOM_ITEM_KIND_PARAM: '<id31007 Desc_EN="BOMitem kind">', // described in ISO, make const with mapping feature
    BOM_ITEM_ATTRIBUTE_PARAM: '<id31008 Desc_EN="BOMitem attribute">', // described in ISO, make const with mapping feature
    BOM_ITEM_INCLUDED_PARAM: '<id31009 Desc_EN="BOMitem included">', // described in ISO, make const with mapping feature
    BOM_ITEM_ID_PARAM: '<id31011 Desc_EN="BOMitem id">', // item id in item db
    BOM_ITEM_NOTE_PARAM: '<id31012 Desc_EN="BOMitem note">', // make a const with note if it's necessary
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
}

const getBomItemAttribute = (item: TurningHolderRecord| CuttingInsertRecord | AssemblyItemRecord) : string => {
    switch (item.type) {
        case 'CUTTING_INSERT': return 'I';
        case 'TURNING_HOLDER': return 'B';
        case 'ASSEMBLY_ITEM': return 'S';
    }
}

const getDateInProperFormat = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}


export const createXMLFile = async (id: string) : Promise<string> => {
    const assemblyToolRecord = await AssemblyToolRecord.getOne(id);

    //TODO close in function depend on assembly type
    const [[turningHolderList]] = await pool.execute('select * from `turning_holder_list` where `assembly_id`=:toolId',{
        toolId: id,
    });
    const [[cuttingInsertList]] = await pool.execute('select * from `cutting_insert_list` where `assembly_id`=:toolId',{
        toolId: id,
    });
    const [[assemblyItemList]] = await pool.execute('select * from `assembly_item_list` where `assembly_id`=:toolId',{
        toolId: id,
    });
    const turningHolder = await TurningHolderRecord.getOne(turningHolderList.turning_holder_id);
    const cuttingInsert = await CuttingInsertRecord.getOne(cuttingInsertList.cutting_insert_id);
    const assemblyItem = await AssemblyItemRecord.getOne(assemblyItemList.assembly_item_id);

    if (!turningHolder || !cuttingInsert || !assemblyItem) {
        return '';
    }

    const items = [turningHolder, cuttingInsert, assemblyItem];

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

    for (const item of items) {
        xmlFileText+= XMLTAGS.BOM_TAG + '\n';
        xmlFileText+= XMLTAGS.BOM_POSITION_PARAM + `${items.indexOf(item) + 1}` + getCloseTag(XMLTAGS.BOM_POSITION_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_PIECES_PARAM + 1 + getCloseTag(XMLTAGS.BOM_ITEM_PIECES_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_DESCRIPTION_PARAM + 'Description' + getCloseTag(XMLTAGS.BOM_ITEM_DESCRIPTION_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_MATERIAL_PARAM + '' + getCloseTag(XMLTAGS.BOM_ITEM_MATERIAL_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_NAME_PARAM + item.name + getCloseTag(XMLTAGS.BOM_ITEM_NAME_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_KIND_PARAM + `${item instanceof CuttingInsertRecord ? 'W' : '" "'}` + getCloseTag(XMLTAGS.BOM_ITEM_KIND_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_ATTRIBUTE_PARAM + getBomItemAttribute(item) + getCloseTag(XMLTAGS.BOM_ITEM_ATTRIBUTE_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_INCLUDED_PARAM + 'R' + getCloseTag(XMLTAGS.BOM_ITEM_INCLUDED_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_ID_PARAM + item.id + getCloseTag(XMLTAGS.BOM_ITEM_ID_PARAM) + '\n';
        xmlFileText+= XMLTAGS.BOM_ITEM_NOTE_PARAM + 'Use only with ...' + getCloseTag(XMLTAGS.BOM_ITEM_NOTE_PARAM) + '\n';
        xmlFileText+= getCloseTag(XMLTAGS.BOM_TAG) + '\n';
    }

    xmlFileText+= getCloseTag(XMLTAGS.SPAREPART_DATA_TAG) + '\n';
    xmlFileText+= getCloseTag(XMLTAGS.TOOL_TAG) + '\n';
    xmlFileText+= getCloseTag(XMLTAGS.TOOL_DATA_TAG) + '\n';

    const filePath = join(__dirname,`../xml/tool_${assemblyToolRecord.id}--${v4()}.xml`);

    await writeFile(filePath, xmlFileText);

    return filePath;
};