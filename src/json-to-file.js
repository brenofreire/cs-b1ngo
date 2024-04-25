const fs = require("fs");

function jsonToFile(player, teams, country = null, wonMajor = null, fileName) {
  const jsonContent = JSON.stringify(
    { player: player.nickname, teams, country, wonMajor },
    null,
    2
  );

  // Escrevendo o JSON para um arquivo
  fs.writeFile(fileName, jsonContent, "utf8", (err) => {
    if (err) {
      console.error("Erro ao escrever o arquivo:", err);
      return;
    }
    console.log("Arquivo JSON criado com sucesso.");
  });
}

module.exports = { jsonToFile };
