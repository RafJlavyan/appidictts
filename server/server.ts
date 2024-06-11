import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import sessionConfig from './configs/sessionConfig';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import corsOptions from './configs/corsOptions'
import connectToMongoDB from './connection/mongoConnection';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './configs/swaggerOptions';
import routes from './routes';

dotenv.config();
connectToMongoDB();
const cookieParserMiddleware = cookieParser();

const app = express();
const port = process.env.PORT || 3002;
app.use(express.json());
app.use(sessionConfig);
app.use(cookieParserMiddleware)
app.use(cors(corsOptions));
app.set("view engine", "ejs");

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});