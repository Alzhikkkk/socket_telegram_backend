'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {foreignKey: 'user', as: 'authors'})
    }
  }
  Message.init({
    text: DataTypes.STRING,
    user: DataTypes.INTEGER,
    users:DataTypes.ARRAY(DataTypes.INTEGER),
    roomId:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};