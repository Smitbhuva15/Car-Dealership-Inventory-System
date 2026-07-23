import express from 'express';
import cors from 'cors';
import routes from './routes';
import cookieParser from "cookie-parser";

const app = express();

app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
  });
});

// Use the routes
app.use('/api', routes);

export { app };