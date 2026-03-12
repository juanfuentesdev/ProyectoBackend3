import express from 'express';
import { engine } from 'express-handlebars';

import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import 'dotenv/config';

import cookieParser from 'cookie-parser'; 
import passport from 'passport'; 
import initializePassport from './config/passport.config.js';
import mocksRouter from './routes/mocks.router.js';
import { addLogger } from './utils/logger.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import usersRouter from './routes/users.router.js'; 
import sessionsRouter from './routes/sessions.router.js'; 

import adoptionRouter from './routes/adoption.router.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import cors from 'cors';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Conectado a la base de datos'))
    .catch(error => console.error('Error al conectar a la base de datos:', error));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));
app.use(cookieParser());
app.use(addLogger);

app.use(cors());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

initializePassport(); 
app.use(passport.initialize()); 

const httpServer = app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/mocks', mocksRouter);

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter); 
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

app.use('/api/adoptions', adoptionRouter);

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación K Tienda / Adoptme',
            description: 'API principal del proyecto'
        }
    },
    apis: [`./src/docs/**/*.yaml`] 
};

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
