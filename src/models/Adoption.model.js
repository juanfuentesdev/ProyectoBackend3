import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'pets' 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

export const AdoptionModel = mongoose.model('Adoption', adoptionSchema);