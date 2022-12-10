import * as express from 'express';
import * as cors from 'cors';
import {loginRouter} from "./Routes/loginRouter";
import {cuttingInsertRouter} from "./Routes/cuttingInsertRouter";
import {turningHolderRouter} from "./Routes/turningHolderRouter";
import {allItemsRouter} from "./Routes/allItemsRouter";
import {assemblyItemRouter} from "./Routes/assemblyItemRouter";
import {setToolRouter} from "./Routes/setToolRouter";
import {xmlRouter} from "./Routes/xmlRouter";
import {paramsRouter} from "./Routes/paramsRouter";
import {millingHolderRouter} from "./Routes/millingHolderRouter";
import {monoMillToolRouter} from "./Routes/monoMillToolRouter";
import {cuttingInsertMillRouter} from "./Routes/cuttingInsertMillRouter";
import {assemblyMillItemRouter} from "./Routes/assemblyMillItemRouter";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/admin', loginRouter);
app.use('/cuttinginsert', cuttingInsertRouter);
app.use('/turningholder', turningHolderRouter);
app.use('/assemblyitem', assemblyItemRouter);
app.use('/all', allItemsRouter);
app.use('/settool', setToolRouter);
app.use('/xml', xmlRouter);
app.use('/params', paramsRouter);
app.use('/millHolder', millingHolderRouter);
app.use('/monoMillTool', monoMillToolRouter);
app.use('/cuttingInsertMill', cuttingInsertMillRouter);
app.use('/assemblyMillItem', assemblyMillItemRouter);

app.listen(4000, () => {
    console.log('App is running on localhost:4000 !');
})