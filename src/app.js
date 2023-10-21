import express from 'express';
import bodyParser from 'body-parser';
import elasticClient from './elastic-client.js';
// import mysqlConnection from './mysql.js';
import creditLineRouter from './routes/creditLine.js';

const app = express();
// ------------------------------ Express configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // ------------------------------ Checking DB connection
// mysqlConnection.connect((err) => {
//     if (err) {
//       console.error('Error connecting to database!', err);
//       return;
//     }
//     console.log('Connected to MySQL database!');
// });

// ------------------------------ Routes
app.use(creditLineRouter);


// ------------------------------ Listening port
const port = process.env.PORT || 8080; 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// ------------------------------ Elastic Search
app.get("/", (req, res) => {
  res.redirect("http://localhost:3000/");
});
app.post("/create-post", async (req, res) => {
  const result = await elasticClient.index({
    index: "posts",
    document: {
      title: req.body.title,
      author: req.body.author,
      content: req.body.content,
    },
  });

  res.send(result);
});
app.delete("/remove-post", async (req, res) => {
  const result = await elasticClient.delete({
    index: "posts",
    id: req.query.id,
  });

  res.json(result);
});
app.get("/search", async (req, res) => {
  const result = await elasticClient.search({
    index: "posts",
    query: { fuzzy: { title: req.query.query } },
  });

  res.json(result);
});
app.get("/posts", async (req, res) => {
  const result = await elasticClient.search({
    index: "posts",
    query: { match_all: {} },
  });

  res.send(result);
});