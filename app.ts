import * as express from 'express';
import * as cors from 'cors';
import {loginRouter} from "./Routes/loginRouter";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/admin', loginRouter);

app.listen(4000, () => {
    console.log('App is running on localhost:4000 !');
})