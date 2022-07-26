router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            include: [
                {
                    model: Post,
                },
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
        });

        const postsByUser = userData.get({ plain: true });

        console.log(postsByUser);

        res.render('dashboard', { posts: postsByUser.posts, loggedIn: req.session.loggedIn },)
    } catch (err) {
        res.status(500).json(err);
    }
});