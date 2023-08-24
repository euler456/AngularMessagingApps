const express = require('express');
const router = express.Router();

const users = [
    {
        username: 'user1',
        birthdate: '1990-01-01',
        age: 31,
        email: 'abc@gmail.com',
        password: '123',
        valid: false
    },
    {
        username: 'user2',
        birthdate: '1990-01-01',
        age: 31,
        email: 'user2@example.com', // Unique email address
        password: 'password2',
        valid: false
    },
    {
        username: 'user3',
        birthdate: '1990-01-01',
        age: 31,
        email: 'user3@example.com', // Unique email address
        password: 'password3',
        valid: false
    }
];

router.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Find the user with the provided email
    const user = users.find(u => u.email === email);

    // Check if user exists and the password matches
    if (user && user.password === password) {
        const { valid, ...userInfo } = user;
        res.json({ valid: true, ...userInfo });
        if (response.valid) {
            // Store user details in session storage
            sessionStorage.setItem('user', JSON.stringify(response.user)); // Assuming 'user' is the key for the user details
            // Redirect to a new page or perform other actions
        }
    } else {
        console.log({ valid: false });
        res.json({ valid: false });
    }
});

module.exports = router;
