import express from 'express';
import * as UsersService from './users-service';

const app = express();
const router = express.Router();

app.use(express.json());

app.set('title', 'Task 2');
app.listen(3000);

// Get auto-suggest list from limit users, sorted by login property and filtered by loginSubstring in the login property
router.get('/users', UsersService.getAutoSuggestUsers);

// Update user by id
router.post('/users/:id', UsersService.validateSchema(UsersService.userSchema), UsersService.updateUser);

// Get user by id
router.get('/users/:id', UsersService.getUserById);

// Delete user by id
router.delete('/users/:id', UsersService.deleteUserById);

// Create user
router.put('/users', UsersService.validateSchema(UsersService.userSchema), UsersService.createUser);
app.use('/', router);
