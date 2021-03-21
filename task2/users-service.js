import { USERS } from './data';
import Joi from 'joi';

const users = [...USERS];

export const userSchema = Joi.object({
    login: Joi.string()
        .required(),
    password: Joi.string()
        .alphanum()
        // Must contain at least one letter and one number
        .pattern(/^(?=.*[A-Za-z])(?=.*[0-9]).{2,}$/)
        .required(),
    age: Joi.number()
        .integer()
        .min(4)
        .max(130)
});

export const errorResponse = (schemaErrors) => {
    const errors = schemaErrors.map((error) => {
        const { path, message } = error;
        return { path, message };
    });
    return {
        status: 'failed',
        errors
    };
};

export const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });
        if (error && error.isJoi) {
            res.status(400).json(errorResponse(error.details));
        } else {
            return next();
        }
    };
};

export const getAutoSuggestUsers = (req, res) => {
    const { limit, loginSubstring } = req.query;
    const suggestedUsers = users
        .filter(user => user.login.toLowerCase().includes(loginSubstring.toLowerCase()) && !user.isDeleted)
        .sort((prev, curr) => {
            if (prev.login < curr.login) {
                return -1;
            }
            return prev.login > curr.login ? 1 : 0;
        })
        .slice(0, limit || 5);
    res.status(200).json(suggestedUsers);
};

export const getUserById = (req, res) => {
    const id = req.params.id;
    const user = users.find(u => u.id === id);
    if (user && !user.isDeleted) {
        res.status(200).json(user);
    } else {
        res.status(404).send({
            message: 'User not found'
        });
    }
};

export const createUser = (req, res) => {
    const user = req.body;
    if (!user) {
        res.status(400).send({
            message: 'No data provided'
        });
    } else {
        const id = new Date().getTime().toString();
        users.push({
            ...user,
            id,
            isDeleted: false
        });
        res.status(201).location(`/users/${id}`).send();
    }
};

export const updateUser = (req, res) => {
    const id = req.params.id;
    const user = req.body;
    if (!user) {
        res.status(400).send({
            message: 'No user data provided'
        });
    } else {
        const userToUpdate = users.find(u => u.id === id && !u.isDeleted);
        if (!userToUpdate) {
            res.status(404).send({
                message: 'User not found'
            });
        } else {
            userToUpdate.login = user.login;
            userToUpdate.password = user.password;
            userToUpdate.age = user.age;
            res.status(204).location(`/users/${id}`).send();
        }
    }
};

export const deleteUserById = (req, res) => {
    const id = req.params.id;
    const user = users.find(u => u.id === id);
    if (user && !user.isDeleted) {
        user.isDeleted = true;
        res.status(200).json({
            message: `User ${user.id} successfully deleted`
        });
    } else {
        res.status(404).send({
            message: 'User not found'
        });
    }
};
