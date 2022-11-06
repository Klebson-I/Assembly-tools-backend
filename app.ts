import * as express from 'express';
import * as cors from 'cors';
import {loginRouter} from "./Routes/loginRouter";
import {cuttingInsertRouter} from "./Routes/cuttingInsertRouter";
import {turningHolderRouter} from "./Routes/turningHolderRouter";
import {allItemsRouter} from "./Routes/allItemsRouter";
import {assemblyItemRouter} from "./Routes/assemblyItemRouter";
import {setToolRouter} from "./Routes/setToolRouter";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/admin', loginRouter);
app.use('/cuttinginsert', cuttingInsertRouter);
app.use('/turningholder', turningHolderRouter);
app.use('/assemblyitem', assemblyItemRouter);
app.use('/all', allItemsRouter);
app.use('/settool', setToolRouter);

app.listen(4000, () => {
    console.log('App is running on localhost:4000 !');
})