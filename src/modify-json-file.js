const fs = require("fs");

const modifyJsonFile = (filePath, objectAppend) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("File reading error:", err);
      return;
    }

    try {
      let jsonObject = JSON.parse(data);

      jsonObject = { ...jsonObject, ...objectAppend };

      const updatedJsonString = JSON.stringify(jsonObject, null, 2);

      // Escrever a string JSON de volta no arquivo
      fs.writeFile(filePath, updatedJsonString, "utf8", (err) => {
        if (err) {
          console.error("File updating error:", err);
          return;
        }
        console.log(`escrevi no arquivo ${filePath}`, updatedJsonString);
      });
    } catch (parseError) {
      console.error("Erro ao fazer o parse do JSON:", parseError);
    }
  });
};

module.exports = {
  modifyJsonFile,
};
