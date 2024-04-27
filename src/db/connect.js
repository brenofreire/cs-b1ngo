let mysql = require("mysql");
const fs = require("fs");
const path = require("path");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// connect to the MySQL server
connection.connect((err) => {
  if (err) return console.error(err.message);

  const createCompetitors = () => {
    const directoryPath = "players";

    const jsonFiles = fs
      .readdirSync(directoryPath)
      .filter((file) => file.endsWith(".json"));

    jsonFiles.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const fileData = fs.readFileSync(filePath, "utf-8");

      const competitor = JSON.parse(fileData);

      const insertQuery = `INSERT INTO competitors (type, name, country, teams, major_winner, iem_champion) VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [
        competitor.type ? competitor.type : "player",
        competitor.player,
        competitor.country,
        JSON.stringify(competitor.teams),
        competitor.wonMajor ? 1 : 0,
        competitor.iemChampion ? 1 : 0,
      ];

      connection.query(insertQuery, values, (error, results, fields) => {
        if (error) {
          console.error(`Erro ao inserir dados do arquivo ${file}:`, error);
        } else {
          console.log(`Dados do arquivo ${file} inseridos com sucesso!`);
        }
      });
    });

    connection.end((err) => {
      if (err) return console.log(err.message);
    });
  };

  createCompetitors();
});
