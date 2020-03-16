const express = require('express');
const router = express.Router();

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

router.get('/', (req, res) => {
    res.send(courses);
});

router.get('/:id', (req, res) => {
    var course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
        // 404 not found
        res.status(404).send('The Course with given ID was not found');
    } else {
        res.send(course);
    }

});

router.post('/', (req, res) => {

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



router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;