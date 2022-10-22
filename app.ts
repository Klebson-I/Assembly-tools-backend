import * as express from 'express';
import * as cors from 'cors';
import {loginRouter} from "./Routes/loginRouter";
import {AssemblyItemRecord} from "./Records/AssemblyItemRecord";
import {cuttingInsertRouter} from "./Routes/cuttingInsertRouter";
import {turningHolderRouter} from "./Routes/turningHolderRouter";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/admin', loginRouter);
app.use('/cuttinginsert', cuttingInsertRouter);
app.use('/turningholder', turningHolderRouter);

(async() => {
    const holder = await AssemblyItemRecord.getAllByMatchingParams('1');
    console.log(holder)
})();

app.listen(4000, () => {
    console.log('App is running on localhost:4000 !');
})