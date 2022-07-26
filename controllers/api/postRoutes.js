const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../a_utils/auth');

//localhost/api/posts
router.get('/', (req, res) => {
    console.log(req.session);

    Post.findAll({
        attributes: [
            'id',
            'title',
            'post_text'
        ],
        include: [
            {
                model: User,
                attributes: ['name','email']
            }
        ],
        include: [
            {
                model: Comment,
                attributes: ['id','comment_content','post_id', 'user_id'],
                include: {
                    model: User,
                    attributes: ['name']
                }
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


router.post('/', withAuth, async (req, res) => {
    try {
        const newPost = await Post.create({
            title: req.body.title,
            post_text: req.body.post_content,
            user_id: req.session.user_id,
        });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
})

router.put('/:id', withAuth, async (req, res) => {
    try {
        const updatePost = await Post.update({
            title: req.body.title,
            post_text: req.body.post_content
        },
        {
            where: {
                id: req.params.id
            }
        }
        );

        res.status(200).json(updatePost);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });
        if (!postData) {
            res.status(404).json({ message: 'No post found under the ID provided' });
            return;
        }
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
