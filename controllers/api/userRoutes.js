const router = require('express').Router();
const { User } = require('../../models');

router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(userData => res.json(userData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.loggedIn = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: {email: req.body.email} });

        if (!userData) {
            res.status(400).json({ message: 'WRONG EMAIL OR PASSWORD' })
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'WRONG EMAIL OR PASSWORD' })
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.loggedIn = true;

            res.json({ user: userData, message: 'Woohoo you are logged in!'})
        })
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.post('/signup', (req, res) => {
    console.log(req.body)
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    .then(userData => {
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.name = userData.name;
            req.session.loggedIn = true;

            res.json(userData);
        });
    });
});

router.get('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
        res.redirect('/login');
    } else {
        res.status(404).end()
    }
});

module.exports = router;