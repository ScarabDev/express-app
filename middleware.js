const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();

const helmet = require('helmet');
const morgan = require('morgan');

const logger = require('./logger');
const auth = require('./authenticate');


// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`);


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());

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

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

app.get('/', (req, res) => {
    res.send('Hello, World!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    var course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
        // 404 not found
        res.status(404).send('The Course with given ID was not found');
    } else {
        res.send(course);
    }

});

app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };

    courses.push(course);
    res.send(course);
});



app.put('/api/courses/:id', (req, res) => {
    var course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
        // 404 not found
        res.status(404).send('The Course with given ID was not found');
        return;
    }

    const { error } = validateCourse(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);

});

app.delete('/api/courses/:id', (req, res) => {
    var course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
        // 404 not found
        res.status(404).send('The Course with given ID was not found');
        return;
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);

});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})