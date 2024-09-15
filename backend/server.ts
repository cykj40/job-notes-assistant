import express, { Request, Response } from 'express';
import cors from 'cors';
import cohere from 'cohere-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

cohere.init(process.env.COHERE_API_KEY as string);

app.post('')