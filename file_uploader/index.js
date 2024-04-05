const express = require('express');
const bodyParser = require('body-parser');
const fileRoutes = require('./fileroute');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config()

app.use(bodyParser.json());
console.log(path.join(__dirname,"uploads"))
app.use("/media",express.static(path.join(__dirname,"uploads")))
global.__basedir = __dirname;
app.use('/api/v1', fileRoutes);
app.use(morgan("common")); 
app.use(cors())
app.use((req, res) => {
    res.status(404).send({
      message: 'The requested URL could not be found.',
      statusCode: 404,
    });
  });
  
app.use((error, req, res, next) => {
    // const { message } = customResourceResponse.serverError;
    const data = {
    Code: `${error.code ? error.code : ''}`,
    Stacktrace: `${error.stack}`
    };
    res.status(500).json({data });
});

function serveStaticFilesRecursive(directory) {
  fs.readdirSync(directory).forEach(file => {
    const filePath = path.join(directory, file);   
    // Si c'est un sous-répertoire, appeler récursivement la fonction
    if (fs.statSync(filePath).isDirectory()) {
      serveStaticFilesRecursive(filePath);
    } else {
      // Si c'est un fichier, servir avec express.static
      app.use(`/media/${path.relative(path.join(__dirname, 'uploads'), filePath)}`, express.static(filePath));
    }
  });
}

// Servir tous les fichiers statiques depuis le répertoire "uploads" et ses sous-répertoires
// serveStaticFilesRecursive(path.join(__dirname, 'uploads'));
const port = 8080;

app.listen(port, () => console.log('File server started and listening on port ' + port));



