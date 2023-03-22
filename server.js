const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const dataFile = path.join(__dirname, "data.json");

// Support POSTing form data with URL encoded
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    next();
});

app.get("/poll", (req, res) => {
    let data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const totalVotes = Object.values(data).reduce((total, n) => total += n, 0);

    data = Object.entries(data).map(([label, votes]) => {
        return {
            label,
            percentage: (((100 * votes) / totalVotes) || 0).toFixed(0)
        }
    });
    res.json(data);
});

app.post("/poll", (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    let tierResults = JSON.parse(Object.keys(req.body))

    for (const property in tierResults) {
        if (Object.hasOwnProperty.bind(data)(property)) {
            data[property] += tierResults[property];
        }
    }

    fs.writeFileSync(dataFile, JSON.stringify(data));

    res.end();
});

app.listen(3000, () => console.log("Server is running..."));