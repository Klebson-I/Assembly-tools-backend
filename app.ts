import * as express from 'express';
import * as cors from 'cors';
import {loginRouter} from "./Routes/loginRouter";
import {TurningHolderRecord} from "./Records/TurningHolderRecord";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/admin', loginRouter);

(async() => {
    const holder = await TurningHolderRecord.getAllByMatchingParams('1');
    console.log(holder)
})();

app.listen(4000, () => {
    console.log('App is running on localhost:4000 !');
})