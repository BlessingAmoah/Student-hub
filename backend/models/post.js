
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    mediaPath: {
      type: DataTypes.STRING,
      allowNull: true
    }

  });
  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'userId' });
    Post.hasMany(models.Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
    Post.hasMany(models.Like, { foreignKey: 'postId', onDelete: 'CASCADE' });
  };

  return Post;
};
