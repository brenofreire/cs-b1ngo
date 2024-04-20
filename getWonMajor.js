const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const _ = require("lodash");
const { players } = require("./lists");
const { delayedLoop } = require("./delayed-loop");
const { modifyJsonFile } = require("./modify-json-file");

const getWonMajor = async (player) => {
  console.log("Buscando dados de ", player);
  const crawUrl = `https://liquipedia.net/counterstrike/${player.liquipediaId}/Results`;
  let wonMajor = false;

  // Webscrapping
  const response = await got(crawUrl);
  const dom = new JSDOM(response.body);

  // Create an Array out of the HTML Elements for filtering using spread syntax.
  const achievements = [
    ...dom.window.document.querySelectorAll(".valvemajor-highlighted"),
  ];

  for (let index = 0; index < achievements.length; index++) {
    let link = achievements[index];

    const linksInside = link.getElementsByTagName("a");
    const isTierS = linksInside[0].innerHTML === "S-Tier";

    if (isTierS) {
      const hasWon = link.getElementsByClassName("placement-1")[0];

      if (hasWon) {
        modifyJsonFile(`players/${player.nickname}.json`, {
          wonMajor: true,
        });

        wonMajor = true;

        break;
      }
    }
  }

  console.log(
    `${player.nickname} ${wonMajor ? "ganhou" : "não ganhou"} o major`
  );
};

delayedLoop(getWonMajor, players);
