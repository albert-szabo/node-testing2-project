const database = require('../data/db-config');
const Animals = require('./animals/animals-model');
const server = require('./server');
const request = require('supertest');

beforeAll(async () => {
    await database.migrate.rollback();
    await database.migrate.latest();
});

beforeEach(async () => {
    await database('animals').truncate();
    await database.seed.run();
});

afterAll(async () => {
    await database.destroy();
});

test('Sanity checks', async () => {
    expect(process.env.NODE_ENV).toBe('testing');
    expect(99 * 99).toEqual(9801);
});

describe('Model tests', () => {
    test('getAll()', async () => {
        const result = await Animals.getAll();
        expect(result).toHaveLength(5);
        expect(result[3]).toHaveProperty('name', 'squirrel');
    });
    test('getByID()', async () => {
        let result = await Animals.getByID(2);
        expect(result).toBeDefined();
        expect(result.id).toBe(2);
        expect(result.name).toBe('dolphin');

        result = await Animals.getByID(27);
        expect(result).not.toBeDefined();
    });
    test('insert()', async () => {
        let result = await Animals.insert({ name: 'cougar' });
        expect(result).toBeDefined();
        expect(result.id).toBe(6);
        expect(result.name).toBe('cougar');

        result = await Animals.getAll();
        expect(result).toHaveLength(6);
        expect(result[5]).toMatchObject({ name: 'cougar' });
    });
    test('update()', async () => {
        let result = await Animals.update(2, { name: 'octopus' });
        expect(result).toBeDefined();
        expect(result.id).toBe(2);
        expect(result.name).toBe('octopus');

        result = await Animals.getAll();
        expect(result).toHaveLength(5);
        expect(result[2]).toMatchObject({ name: 'lynx' });

        result = await Animals.update(35, { name: 'cheetah' });
        expect(result).not.toBeDefined();
    });
    test('remove()', async () => {
        let result = await Animals.remove(5);
        expect(result).toBeDefined();
        expect(result.id).toBe(5);
        expect(result.name).toBe('owl');

        result = await Animals.getAll();
        expect(result).toHaveLength(4);
        expect(result[0]).toMatchObject({ name: 'giraffe' });

        result = await Animals.remove(27);
        expect(result).not.toBeDefined();
    });
});

describe('HTTP tests', () => {
    test('API is up and running', async () => {
        let response = await request(server).get('/');
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'The API is up and running.' });
    });
    test('GET /animals', async () => {
        let response = await request(server).get('/animals');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(5);
    });

    test('GET /animals/:id', async () => {
        let response = await request(server).get('/animals/2');
        expect(response).toBeDefined();
        expect(response.body.id).toBe(2);
        expect(response.body.name).toBe('dolphin');

        response = await request(server).get('/animals/17');
        expect(response.statusCode).toBe(404);
    });
    test('POST /animals', async () => {
        let response = await request(server).post('/animals').send({ name: 'hawk' });
        expect(response.body.id).toBe(6);
        expect(response.body.name).toBe('hawk');

        let result = await Animals.getAll();
        expect(result).toHaveLength(6);
        expect(result[5]).toMatchObject({ name: 'hawk' });

        response = await request(server).post('/animals').send({ somethingElse: 'placeholder' });
        expect(response.body).toEqual({ message: 'Please provide a name for the new animal.' });
        expect(response.status).toBe(400);

        result = await Animals.getAll();
        expect(result).toHaveLength(6);
    });
    test('PUT /animals/:id', async () => {
        let response = await request(server).put('/animals/2').send({ name: 'squid' });
        expect(response.body.id).toBe(2);
        expect(response.body.name).toBe('squid');

        const result = await Animals.getAll();
        expect(result).toHaveLength(5);
        expect(result[2]).toMatchObject({ name: 'lynx' });

        response = await request(server).put('/animals/29').send({ name: 'grasshopper' });
        expect(response.statusCode).toBe(404);
    });
    test('DELETE /animals/:id', async () => {
        let response = await request(server).delete('/animals/5');
        expect(response.body.id).toBe(5);
        expect(response.body.name).toBe('owl');

        const result = await Animals.getAll();
        expect(result).toHaveLength(4);
        expect(result[2]).toMatchObject({ name: 'lynx' });

        response = await request(server).delete('/animals/17');
        expect(response.statusCode).toBe(404);
    });
});