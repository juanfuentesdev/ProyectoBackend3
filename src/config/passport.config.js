import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import 'dotenv/config';
import { UserModel } from '../models/User.model.js';


const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['authToken']; 
    }
    return token;
};

const initializePassport = () => {
    passport.use('jwt', new JwtStrategy(
        {

            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: process.env.JWT_SECRET
        },
        async (jwt_payload, done) => {

            try {

                const user = await UserModel.findById(jwt_payload.id);
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado.' });
                }
                return done(null, user); 
            } catch (error) {
                return done(error);
            }
        }
    ));
};

export default initializePassport;