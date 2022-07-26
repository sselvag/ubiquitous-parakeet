router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes: [
                'id',
                'title',
                'post_text'
            ],
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const allPosts = postData.map((post) => {
            post.get({ plain: true });
        });

        console.log(allPosts);

        res.render('homepage', { posts: allPosts });
    } catch (err) {
        res.status(500).json(err);
    }
});