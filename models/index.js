const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// a single user has many posts
User.hasMany(Post, {
    foreignKey: 'user_id'
});
// posts belong to the user
Post.belongsTo(User, {
    foreignKey: 'user_id'
});
//comments belong to a user
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});
//comments also belong to a post
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});
//posts have many comments
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});
//users have many comments
User.hasMany(Comment, {
    foreignKey: 'user_id'
});

module.exports = { User, Post, Comment };