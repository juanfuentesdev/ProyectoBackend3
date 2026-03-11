import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Testing del Router de Adopciones', () => {
    it('GET /api/adoptions debe devolver status 200 y un array', async () => {
        const { statusCode, body } = await requester.get('/api/adoptions');
        expect(statusCode).to.equal(200);
        expect(Array.isArray(body.payload)).to.be.true;
    });

    it('GET /api/adoptions/:aid debe devolver 404 si no existe la adopción', async () => {
        const fakeId = '60d5ec49f1b2c8b1f8e4e1a2'; 
        const { statusCode } = await requester.get(`/api/adoptions/${fakeId}`);
        expect(statusCode).to.equal(404);
    });

    it('POST /api/adoptions/:uid/:pid debe devolver 404 si el usuario no existe', async () => {
        const fakeId = '60d5ec49f1b2c8b1f8e4e1a2';
        const { statusCode } = await requester.post(`/api/adoptions/${fakeId}/${fakeId}`);
        expect(statusCode).to.equal(404);
    });
});