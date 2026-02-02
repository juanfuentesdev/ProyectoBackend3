import bcrypt from 'bcrypt';

// Función para encriptar (la usaremos en el Mocking)
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};