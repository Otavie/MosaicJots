const jest = require('jest');
const { describe, beforeEach } = require('node:test');
const { postSignup } = require('./signupController');

describe('postSignup', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn(() => res),
            render: jest.fn(),
            cookie: jest.fn(),
            redirect: jest.fn(),
            json: jest.fn(),
        };
    });

    it('should handle successful user registration', async () => {
        req.body = {
            first_name: 'Otavie',
            last_name: 'Love',
            email: 'otavie@meta.com',
            password: '12abCD*#'
        };

        const userModel = {
            findOne: jest.fn().mockResolveValue(null),
            save: jest.fn().mockResolveValue(),
        };
        jest.mock('../../model/UserModel', () => userModel);

        const bcrypt = require('bcrypt');
        bcrypt.hash = jest.fn().mockResolveValue('hashedPassword');

        const jwt = require('jsonwebtoken');
        jwt.sign = jwt.fn().mockResolveValue('token');

        req.session = {};

        await postSignup(req, res);

        expect(userModel.findOne).toHaveBeenCalledWith({ email: 'otavie@meta.com' });
        expect(userModel.save).toHaveBeenCalledWith({
            first_name: 'Otavie',
            last_name: 'Love',
            email: 'otavie@meta.com',
            password: 'hashedPassword'
        });

        expect(jwt.sign).toHaveBeenCalledWith({ userId: undefined }, 'jwt_secret', { expiredIn: 3600 });
        expect(res.cookie).toHaveBeenCalledWith('token', 'token', { httpOnly: true, maxAge: 3600000 });
        expect(req.session.email).toBe('otavie@meta.com');
        expect(req.session.first_name).toBe('Otavie');
        expect(req.session.last_name).toBe('Love');
        expect(req.session.successMessage).toBe('User registered successfully!');
        expect(res.redirect).toHaveBeenCalledWith('/dashboard');
        expect(res.status).not.toHaveBeenCalled();
    });

})