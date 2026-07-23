import express from 'express';
import cors from 'cors';
import routes from './routes';
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
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