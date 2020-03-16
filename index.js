const config = require('config');
const Joi = require('joi');

const logger = require('./logger');
const auth = require('./authenticate');
const helmet = require('helmet');
const morgan = require('morgan');

const courses = require('./routes/courses');
const home = require('./routes/home');

const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.set('views', './views'); // default

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());

app.use('/api/courses', courses);
app.use('/', home);

// Configuration

console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
} else {
    console.log('Morgan disabled...');
}

app.use(logger);
app.use(auth);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})