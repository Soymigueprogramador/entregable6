import mongoose from 'mongoose';

export async function conectameMongodb() {
    try {
        await mongoose.connect('mongodb://localhost:27017', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB llamada "E"');
    } catch (error) {
        console.error('UH capo algo salió mal y no te conectaste a la base de datos', error);
    }
};
conectameMongodb();