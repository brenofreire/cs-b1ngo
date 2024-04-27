const { Op } = require("sequelize");
const { Competitor, sequelize } = require("./competitors-model"); // Importa o modelo Competitor
const _ = require("lodash");

async function getCompetitors() {
  try {
    const maxCompetitors = 40;

    let competitors = await Competitor.findAll({
      order: [sequelize.literal("RAND()")],
      limit: 30,
    });

    let countries = { qty: 0, list: [] };

    let majorWinners = { qty: 0, list: [] };

    competitors = competitors.map((data) => data.dataValues);

    countries.list = _.uniq(
      competitors.map((competitorX) => competitorX.country)
    );
    countries.qty = countries.list.length;

    majorWinners.list = _.uniq(
      competitors.map((competitorX) => competitorX.major_winner)
    );
    majorWinners.qty = majorWinners.list.length;

    competitorsId = competitors.map((competitorX) => competitorX.id);

    console.log(`
        qty countries: ${countries.qty} 
        qty major: ${majorWinners.qty} 
      `);

    // VERIFY IF NEEDS TO GET MORE PEOPLE WITH DIFFERENT COUNTRY OR MORE MAJOR WINNERS

    const enoughMajorWinner = majorWinners.qty >= 4;
    let lookForMajorWinner = enoughMajorWinner ? {} : { major_winner: 1 };

    const enoughCountries = countries.qty >= 4;
    let lookForDifferentCountries = enoughCountries
      ? {}
      : {
          country: {
            [Op.notIn]: countries.list,
          },
        };

    // NEEDS ?

    console.log("======>", {
      enoughCountries,
      lookForDifferentCountries,
      lookForMajorWinner,
      enoughMajorWinner,
    });

    let competitorsLeft = await Competitor.findAll({
      limit: maxCompetitors - competitors.length,
      where: {
        id: {
          [Op.notIn]: competitorsId,
        },
        ...lookForMajorWinner,
        ...lookForDifferentCountries,
      },
    });

    competitors = [...competitors, ...competitorsLeft];

    stillNotSatisfied = competitors.length < 40;

    if (stillNotSatisfied) {
      let competitorsLeft = await Competitor.findAll({
        limit: maxCompetitors - competitors.length,
        where: {
          id: {
            [Op.notIn]: competitorsId,
          },
          ...lookForMajorWinner,
          ...lookForDifferentCountries,
        },
      });

      competitors = [...competitors, ...competitorsLeft];
    }

    return { competitors };
  } catch (error) {
    console.error("Erro ao recuperar os competidores:", error);
    throw error;
  }
}

// Uso
getCompetitors()
  .then((competitors) => {
    console.log(competitors);
  })
  .catch((error) => {
    console.error("Erro:", error);
  });
