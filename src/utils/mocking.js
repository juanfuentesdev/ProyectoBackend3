import { faker } from '@faker-js/faker';
import { createHash } from './hash.js'; 

export const generateMockUsers = (quantity) => {
    const users = [];
    

    const hashedPassword = createHash('coder123'); 

    for (let i = 0; i < quantity; i++) {
        users.push({
            _id: faker.database.mongodbObjectId(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int({ min: 18, max: 65 }),
            password: hashedPassword, 
            role: faker.helpers.arrayElement(['user', 'admin']),
            pets: [] 
        });
    }
    return users;
};


export const generateMockPets = (quantity) => {
    const pets = [];
    for (let i = 0; i < quantity; i++) {
        pets.push({
            _id: faker.database.mongodbObjectId(),
            name: faker.animal.dog(),
            specie: faker.helpers.arrayElement(['dog', 'cat', 'rabbit']),
            age: faker.number.int({ min: 1, max: 20 }),
            adopted: false,
            image: faker.image.urlLoremFlickr({ category: 'animals' })
        });
    }
    return pets;
};