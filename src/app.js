import express from 'express'; 
import handlebars from 'express-handlebars'; 
import path from 'path'; 
import __dirname from './utils.js';
import apiCartRouter from './routes/cart.router.js'; 
import apiProductRouter from './routes/product.router.js';
import apiVistasRouter from './routes/vistas.router.js';  
import apiRouter from './dao/admin.mdb.js'; 
import { Server } from 'socket.io';
import { chatModel } from './dao/models/user.models.js'; 
import { conectameMongodb } from './config/config.db.js'

const PORT = 3000;
const app = express(); 

app.engine('handlebars', handlebars.engine()); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/socket.io', express.static(path.join(__dirname, '../node_modules/socket.io/client-dist'))); 
app.use(express.json()); 
app.use('/api', apiRouter); 
 
const server = app.listen(PORT, () => {
    console.log('Entregable6 esta escuchando en el, ${PORT}');
});