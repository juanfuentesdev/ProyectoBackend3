import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Testing del Router de Adopciones (adoption.router.js)', () => {

    describe('GET /api/adoptions', () => {
        it('Caso de Éxito: Debe devolver status 200 y un array de adopciones', async () => {
            const { statusCode, body } = await requester.get('/api/adoptions');
            
            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(Array.isArray(body.payload)).to.be.true;
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('Caso de Error: Debe devolver 404 si no existe la adopción solicitada', async () => {
            const fakeId = '60d5ec49f1b2c8b1f8e4e1a2'; // ID de Mongo válido pero inexistente
            const { statusCode, body } = await requester.get(`/api/adoptions/${fakeId}`);
            
            expect(statusCode).to.equal(404);
            expect(body.status).to.equal('error');
            expect(body.error).to.exist; // Verifica que el backend explique el error
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('Caso de Error: Debe devolver 404 si el usuario no existe', async () => {
            const fakeUserId = '60d5ec49f1b2c8b1f8e4e1a2';
            const fakePetId = '60d5ec49f1b2c8b1f8e4e1a2';
            const { statusCode, body } = await requester.post(`/api/adoptions/${fakeUserId}/${fakePetId}`);
            
            expect(statusCode).to.equal(404);
            expect(body.status).to.equal('error');
        });

    });
});