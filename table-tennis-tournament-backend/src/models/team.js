const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Team = sequelize.define('Team', {
    team_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    team_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    captain_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    captain_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    primary_sport: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'teams',
    timestamps: false
  });

  return Team;
};