import * as express from 'express';
import * as cors from 'cors';
import {loginRouter} from "./Routes/loginRouter";
import {AssemblyItemRecord} from "./Records/AssemblyItemRecord";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/admin', loginRouter);

(async() => {
    const holder = await AssemblyItemRecord.getAllByMatchingParams('1');
    console.log(holder)
})();

app.listen(4000, () => {
    console.log('App is running on localhost:4000 !');
})