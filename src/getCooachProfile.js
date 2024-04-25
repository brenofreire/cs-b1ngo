const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const _ = require("lodash");
const { teams, coaches, players } = require("./lists");
const { jsonToFile } = require("./json-to-file");
const { delayedLoop } = require("./delayed-loop");

const getTeamTrained = async (coach) => {
  console.log(`pegando dados de ${coach.nickname}`);
  const crawUrl = `https://liquipedia.net/counterstrike/${coach.liquipediaId}`;
  const teamsCoached = [];

  // Webscrapping
  const response = await got(crawUrl);
  const dom = new JSDOM(response.body);

  // Create an Array out of the HTML Elements for filtering using spread syntax.
  const career = [
    ...dom.window.document.querySelectorAll(".infobox-center * div"),
  ];

  //Country
  const country = dom.window.document.querySelectorAll(".flag")[0];
  const countryName = country && country.getElementsByTagName("a")[0].title;

  console.log(`${coach.nickname} é desse pais: ${countryName}`);

  career.forEach((link) => {
    const role = link.getElementsByTagName("i")[0];

    if (role && role.innerHTML.toLocaleLowerCase() == "(coach)") {
      teamsCoached.push(link.getElementsByTagName("a")[0].innerHTML);
    }
  });

  console.log(`treinou isso ${teamsCoached.join(", ")}`);

  const liquipediaTeams = _.uniq(teamsCoached);

  const validTeams = _.intersection(
    liquipediaTeams,
    teams.map((team) => team.name)
  );

  jsonToFile(
    coach,
    validTeams,
    countryName,
    false,
    `players/coach-${player.nickname}.json`
  );
};

delayedLoop(getTeamTrained, coaches);
