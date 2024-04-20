const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const _ = require("lodash");
const { teams, coaches } = require("./lists");
const { jsonToFile } = require("./json-to-file");
const { delayedLoop } = require("./delayed-loop");

const getTeamTrained = async (coach) => {
  const crawUrl = `https://liquipedia.net/counterstrike/${coach}`;

  // Webscrapping
  const response = await got(crawUrl);
  const dom = new JSDOM(response.body);

  // Create an Array out of the HTML Elements for filtering using spread syntax.
  const career = [
    ...dom.window.document.querySelectorAll(".infobox-center * div"),
  ];

  career.forEach((link) => {
    const role = link.getElementsByTagName("i")[0];

    if (role && role.innerHTML.toLocaleLowerCase() == "(coach)") {
      teamsCoached.push(link.getElementsByTagName("a")[0].innerHTML);
    }
  });

  const liquipediaTeams = _.uniq(teamsCoached);

  const validTeams = _.intersection(liquipediaTeams, teams);

  jsonToFile(`coach-${coach}`, validTeams);
};

delayedLoop(getTeamTrained, coaches);
