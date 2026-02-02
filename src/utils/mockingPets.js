import { faker } from '@faker-js/faker';

export const generateMockPets = (quantity) => {
    const pets = [];

    for (let i = 0; i < quantity; i++) {
        pets.push({
            _id: faker.database.mongodbObjectId(),
            name: faker.animal.dog(), 
            specie: faker.helpers.arrayElement(['dog', 'cat', 'rabbit', 'bird']),
            age: faker.number.int({ min: 1, max: 15 }),
            adopted: false,
            owner: null,
            image: faker.image.urlLoremFlickr({ category: 'animals' })
        });
    }
    return pets;
};