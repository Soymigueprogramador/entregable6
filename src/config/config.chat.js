import express from 'express';
import { Server } from 'socket.io';
import __dirname from '../utils'; 
import { chatModel } from '../dao/models/user.models';

export function configChat(server) {
    const app = Express();
    let Mensaje = [];
    leerMensajes();
    let usuario = [];
};
configChat();

const io = new Server(server);

app.locals.io = io;

io.on('connection', (socket) => {
    console.log(`Se conectó un usuario nuevo con el id ${socket.id}`);
    socket.on('id', (email) => {
        console.log(`Se conectó un usuario con el ${email}`);
        mensajes.push({
            user: 'server',
            mensaje: 'Hola, te damos la bienvenida al chat. ¿En qué podemos ayudarte?',
        });
        usuarios.push({ id: socket.id, usuario: email });
        socket.emit('Bienvenido', mensajes);
        socket.broadcast.emit('nuevoUsuario', email);
        mensajes.pop();
    });

    socket.on('nuevoMensaje', (mensaje) => {
        mensajes.push(mensaje);
        io.emit('llegoUnNuevoMensaje', mensaje);
        const nuevoMensaje = new chatModel({
            user: mensaje.user,
            mensaje: mensaje.mensaje,
        });
        nuevoMensaje.save()
            .then(() => {
                console.log('Mensaje guardado');
            })
            .catch((error) => {
                console.log('Error al guardar el mensaje', error);
            });
    });
    socket.on('disconnect', () => {
        console.log(`Se desconectó el cliente con el ID ${socket.id}`);
        const indice = usuarios.findIndex((usuario) => usuario.id === socket.id);
        if (indice >= 0) {
            const emailDesconectado = usuarios[indice].usuario;
            socket.broadcast.emit('desconeccion', emailDesconectado);
            usuarios.splice(indice, 1);
        }
    });
});

async function leerMensajes() {
    try {
        const mensajesDB = await chatModel.find({}, 'user mensaje').exec();
        const mensajeArray = mensajesDB.map((documento) => ({
            user: documento.user,
            mensaje: documento.mensaje,
        }));
        mensajes.length = 0;
        mensajes.push(...mensajeArray);
    } catch (error) {
        console.error('Error al leer los mensajes guardados:', error);
    }
};
leerMensajes();