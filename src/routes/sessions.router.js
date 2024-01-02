import { Router } from 'express'; 
import bodyParser from 'body-parser'; 
import { conectameMongodb } from '../config/config.db';
import crypto from 'crypto'; 

const router = Router();

router.use(bodyParser.urlencoded({ extended: true })); 

router.post('/registro', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (!name || !email || !password ) {
        return res.redirect('/registro ? error = Che te faltan datos'); 
    };
    if(!validarCorreoElectronico(email)) {
        return res.redirect('/registro ? error = Usa un correo electronico valido por favor');
    };
    password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64'); 
    conectameMongodb.createUsuario(name, email, password); 
    res.redirect('/login ? usuarioCreado = ${email}'); 
});

router.post('/login', async (req, res) => {
    let name = req.body.name;
    let password = req.body.password; 
    const emailDelAdministrador = 'soymigueprogramador@gmail.com';
    const passwordDelAdministrador = 'soymigueprogramador'; 
});
if(email === emailDelAdministrador) {
    if(password === passwordDelAdministrador) {
        req.sessions.usuario = {
            nombre : 'Miguel',
            carrito: null, 
            email: email, 
            typeofuser: 'administrador',
        };
        return res.redirect('/administrador');
    } else {
        return res.redirect('/login ? error = Contraseña incorrecta bro');
    };
    if(!email || !password) {
        return res.redirect('/registro ? error = Che te faltan datos');
    };
    password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64');
    let usuario = await conectameMongodb.obtenerUsuarioPorEmail(email); 
    if(!usuario) {
        return res.redirect('/login ? error = El usuario no existe en la base de datos');
    };
    if(usuario.password !== password) {
        return res.redirect('/login ? error = Contraseña incorrecta bro');
    };
    req.sessions.usuario = {
            nombre : usuario.name,
            carrito: usuario.cartId, 
            email: usuario.email, 
            typeofuser: 'usuario',
        };
    return res.redirect('/product'); 
};

router.get('/logout', async (req,res) => {
    req.session.destroy(e=> console.error(e)),
    res.redirect('/login?mensaje=logout correcto... !')
}) = 


function validarCorreoElectronico(correo) {
    const expresionRegular = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return expresionRegular.test(correo); 
};
validarCorreoElectronico()