const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("cs_bingo", "root", "04021998", {
  dialect: "mysql",
  host: "localhost",
});

const Competitor = sequelize.define(
  "competitor",
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teams: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    major_winner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    iem_champion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = { Competitor, sequelize };
