import express from 'express';
import dotenv from  'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
