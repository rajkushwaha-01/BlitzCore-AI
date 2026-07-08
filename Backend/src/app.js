import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/api/auth", authRouter);




export default app; 