const { Sequelize } = require('sequelize');
const PlayerModel = require('./player');
const TeamModel = require('./team');
const MatchModel = require('./match');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false
  }
);

// Initialize all models
const Player = PlayerModel(sequelize);
const Team = TeamModel(sequelize);
const Match = MatchModel(sequelize);

// Define associations
Player.belongsTo(Team, { foreignKey: 'team_id' });
Team.hasMany(Player, { foreignKey: 'team_id' });

// Export models + sequelize instance
module.exports = {
  sequelize,
  Player,
  Team,
  Match
};