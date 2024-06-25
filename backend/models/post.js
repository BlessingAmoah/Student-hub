
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
    }
    
  });
  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'userId' });
    Post.hasMany(models.Comment, { foreignKey: 'postId' });
    Post.hasMany(models.Like, { foreignKey: 'postId' });
  };

  return Post;
};
