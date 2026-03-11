import { Router } from 'express';
import { AdoptionModel } from '../models/Adoption.model.js';
import { UserModel } from '../models/User.model.js';
import { PetModel } from '../models/Pet.model.js';

const router = Router();

// GET: Obtener todas las adopciones
router.get('/', async (req, res) => {
    try {
        const adoptions = await AdoptionModel.find();
        res.send({ status: "success", payload: adoptions });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

// GET: Obtener una adopción por ID
router.get('/:aid', async (req, res) => {
    try {
        const adoption = await AdoptionModel.findById(req.params.aid);
        if (!adoption) return res.status(404).send({ status: "error", error: "Adoption not found" });
        
        res.send({ status: "success", payload: adoption });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

// POST: Crear una adopción (Recibe ID de usuario y ID de mascota)
router.post('/:uid/:pid', async (req, res) => {
    try {
        const { uid, pid } = req.params;

        // 1. Verificar que el usuario exista
        const user = await UserModel.findById(uid);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });

        // 2. Verificar que la mascota exista y no esté adoptada
        const pet = await PetModel.findById(pid);
        if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });
        if (pet.adopted) return res.status(400).send({ status: "error", error: "Pet is already adopted" });

        // 3. Actualizar la mascota
        pet.adopted = true;
        pet.owner = user._id;
        await pet.save();

        // 4. Actualizar al usuario (Le agregamos la mascota a su array)
        user.pets.push(pet._id);
        await user.save();

        // 5. Crear el registro de adopción
        const adoption = await AdoptionModel.create({ owner: user._id, pet: pet._id });

        res.send({ status: "success", message: "Adoption created successfully", payload: adoption });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

export default router;