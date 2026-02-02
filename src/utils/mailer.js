import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendRecoveryEmail = async (email, token) => {
    const link = `http://localhost:8080/reset-password?token=${token}`;
    
    await transporter.sendMail({
        from: `K tienda <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Restablecer Contraseña - K tienda',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h1 style="color: #333;">Restablece tu contraseña</h1>
                <p>Hola,</p>
                <p>Has solicitado restablecer tu contraseña en <strong>K tienda</strong>.</p>
                <p>Haz clic en el botón de abajo para crear una nueva. Este enlace expirará en 1 hora.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${link}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a>
                </div>
                
                <p style="font-size: 12px; color: #888;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
            </div>
        `
    });
};