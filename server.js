const express = require('express');
const connectDB = require('./config/db');
const app = express();

connectDB();

app.use(express.json({ extended: false })); 

app.get('/', (req, res) => res.send('welcome to express server page.')) 

app.use('/api/users', require('./routes/users.js'));
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/employee', require('./routes/employee'));

const PORT = process.env.PORT  || 5000;

app.listen(PORT, () => console.log('server running..'));
