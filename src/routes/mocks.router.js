import { Router } from 'express';
import { generateMockUsers, generateMockPets } from '../utils/mocking.js';
import { UserModel } from '../models/User.model.js';
import { PetModel } from '../models/Pet.model.js';   

const router = Router();


router.get('/mockingpets', (req, res) => {
    const pets = generateMockPets(100); 
    res.send({ status: "success", payload: pets });
});


router.get('/mockingusers', async (req, res) => {
    const users = await generateMockUsers(50);
    res.send({ status: "success", payload: users });
});


router.post('/generateData', async (req, res) => {
    const { users, pets } = req.body; 

    try {
        const mockUsers = await generateMockUsers(users);
        const mockPets = generateMockPets(pets);


        await UserModel.insertMany(mockUsers);
        await PetModel.insertMany(mockPets);

        req.logger.info(`Generados e insertados: ${users} usuarios y ${pets} mascotas.`);
        res.send({ status: "success", message: "Datos insertados en DB exitosamente" });

    } catch (error) {
        req.logger.error(`Error generando data: ${error.message}`);
        res.status(500).send({ status: "error", error: error.message });
    }
});


router.get('/loggerTest', (req, res) => {
    req.logger.fatal("Prueba Fatal");
    req.logger.error("Prueba Error");
    req.logger.warning("Prueba Warning");
    req.logger.info("Prueba Info");
    req.logger.http("Prueba Http");
    req.logger.debug("Prueba Debug");

    res.send("Logs probados. Revisa la consola y errors.log");
});

export default router;