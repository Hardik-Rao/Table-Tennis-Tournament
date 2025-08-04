const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Match = sequelize.define('Match', {
    match_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    team1_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    team2_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    match_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    match_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sport: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
      defaultValue: 'scheduled'
    },
    team1_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    team2_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    winner_team: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'matches',
     schema: 'public', 
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Match;
};