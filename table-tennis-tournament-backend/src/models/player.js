const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Player = sequelize.define('Player', {
    player_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    team_id: {
      type: DataTypes.INTEGER,
    },
    player_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roll_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    branch: DataTypes.STRING,
    year: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    sport: DataTypes.STRING,
    playing_style: DataTypes.STRING,
    grip_style: DataTypes.STRING,
    rubber_type: DataTypes.STRING,
    player_position: DataTypes.INTEGER,
    avatar_url: DataTypes.TEXT
  }, {
    tableName: 'players',
    timestamps: false
  });

  return Player;
};
