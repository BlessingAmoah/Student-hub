const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: 'userId' });
    Like.belongsTo(models.Post, { foreignKey: 'postId' });
  };

  return Like;
};
