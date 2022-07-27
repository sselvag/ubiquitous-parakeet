const { Post, User, Comment } = require('../../models');
const withAuth = require('../../a_utils/auth.js');
const router = require('express').Router();

router.get('/', (req, res) => {
    console.log(req.session);

    Post.findAll({
        attributes: [
            'id',
            'title',
            'post_text',
            'createdAt'
        ],
        include: [
            {
                model: User,
                attributes: ['name','email']
            }
        ]
    })
    .then(postData => {
        const posts = postData.map(post => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch (err => {
        console.log(err)
        res.status(500).json(err);
    });
});

router.get('/post/:id', async (req, res) => {
    const postData = await Post.findByPk(req.params.id, {
        include: [
            {
                model: User,
                attributes: ['name','email'],
            },
        ],
        include: [
            {
                model: Comment,
                attributes: ['id','comment_content','post_id', 'user_id', 'createdAt'],
                include: {
                    model: User,
                    attributes: ['name']
                }
            }
        ]
    });

    const onePost = postData.get({ plain: true });
    console.log(onePost)

    res.render('single-post', {
        post: onePost,
        loggedIn: req.session.loggedIn
    });
});

router.get('/login', async (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
    } else {
        res.render('login')
    }
});

router.get('/dashboard', (req, res) => {
    console.log(req.session);

    Post.findAll({
        where: {
           user_id: req.session.user_id 
        },
        attributes: [
            'id',
            'title',
            'post_text',
            'createdAt'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id','comment_content','post_id','user_id'],
                include: {
                    model: User,
                    attributes: ['name','email']
                }
            },
            {
                model: User,
                attributes: ['name','email']
            }
        ]
    })
    .then(postData => {
        const posts = postData.map(post => post.get({ plain: true }));
        res.render('dashboard', {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch (err => {
        console.log(err)
        res.status(500).json(err);
    });
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup')
})

router.get('/dashboard/create/', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            include: [
                {
                    model: Post,
                },
            ],
        });

        const postsByUser = userData.get({ plain: true });

        console.log(postsByUser);

        res.render('create-post', { posts: postsByUser.posts, loggedIn: req.session.loggedIn },)
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard/edit/:id', async (req, res) => {
    const postData = await Post.findByPk(req.params.id, {
        include: [
            {
                model: User,
                attributes: ['name'],
            },
        ],
        include: [
            {
                model: Comment,
                attributes: ['id','comment_content','post_id', 'user_id', 'createdAt'],
                include: {
                    model: User,
                    attributes: ['name']
                }
            }
        ]
    });

    const onePost = postData.get({ plain: true });
    console.log(onePost)

    res.render('edit-post', {
        post: onePost,
        loggedIn: req.session.loggedIn
    });
});

module.exports = router;