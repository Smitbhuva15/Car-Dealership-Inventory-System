import express from 'express';
import cors from 'cors';
import routes from './routes';
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Use the routes
app.use('/api', routes);

export { app };