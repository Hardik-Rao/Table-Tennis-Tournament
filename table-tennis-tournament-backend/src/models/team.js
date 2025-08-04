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
      unique: true,
      validate: {
        isEmail: true
      }
    },
    captain_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    captain_roll_number: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    captain_branch: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    captain_year: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    captain_phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    primary_sport: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'teams',
     schema: 'public', 
    timestamps: false
  });

  return Team;
};