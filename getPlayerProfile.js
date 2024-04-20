const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const _ = require("lodash");
const { players, teams } = require("./lists");
const { delayedLoop } = require("./delayed-loop");
const { modifyJsonFile } = require("./modify-json-file");
const { jsonToFile } = require("./json-to-file");

const getPlayerProfile = async (player) => {
  console.log(">>> Montando os dados do jogador ", player);
  const crawUrl = `https://liquipedia.net/counterstrike/${player.liquipediaId}`;
  const teamsPlayed = [];

  try {
    // Webscrapping
    const response = await got(crawUrl);
    const dom = new JSDOM(response.body);
    const allLiquipediaTeams = [
      ...dom.window.document.querySelectorAll(".infobox-center * a"),
    ];
    // End Webscrapping
    const country = dom.window.document.querySelectorAll(".flag")[0];
    const countryName = country && country.getElementsByTagName("a")[0].title;
    // getting all times in career
    allLiquipediaTeams.forEach((link) => {
      teamsPlayed.push(link.innerHTML);
    });
    const liquipediaTeamsUnique = _.uniq(teamsPlayed);
    const validTeams = _.intersection(
      liquipediaTeamsUnique,
      teams.map((teamX) => teamX.name)
    );

    jsonToFile(player, validTeams, countryName);
  } catch (error) {
    console.log({ error });
  }
};

delayedLoop(getPlayerProfile, players);
