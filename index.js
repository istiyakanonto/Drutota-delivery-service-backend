const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const cors = require("cors");
const bodyParser = require("express");
require("dotenv").config();
const port = process.env.PORT || 5040;
//midleWire
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello Istiyak Ahmed!");
});
//My working

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uplvf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);
client.connect((err) => {
  console.log("Connection Error", err);
  const serviceCollection = client.db("active").collection("fast");
  const reviewCollection = client.db("active").collection("second");
  const orderCollection = client.db("active").collection("third");
  const adminCollection = client.db("active").collection("fourth");
  console.log("DB connected Successfully");

  //get service data(1st Collection)
  app.get("/service", (req, res) => {
    serviceCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  //post data
  app.post("/addService", (req, res) => {
    const newService = req.body;
    serviceCollection.insertOne(newService).then((result) => {
      //  console.log('inserted Count:',result.insertedCount)
      res.send(result.insertedCount > 0);
    });
  });
//third collection
  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    console.log(newProduct);
    orderCollection.insertOne(newProduct);
  });
  app.get("/order", (req, res) => {
    orderCollection.find({ email: req.query.email }).toArray((err, items) => {
      res.send(items);
    });
  });

  //fourth collection

  app.post("/addAdmin", (req, res) => {
    const newAdmin = req.body;
    console.log(newAdmin);
    adminCollection.insertOne(newAdmin);
  });

  //fourth collection
  app.get("/admin", (req, res) => {
    adminCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });


  app.get("/allOrder", (req, res) => {
    orderCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  //get data for single service
  app.get("/serve/:id", (req, res) => {
    serviceCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  //delete data for single Service
  app.delete("/itemDelete/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    console.log("Delete this", id);
    serviceCollection.findOneAndDelete({ _id: id }).then((documents) => {
      res.send(documents.deleteCount > 0);
      console.log(documents);
    });
  });

  //get service data(2nd collection)
  app.get("/review", (req, res) => {
    reviewCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  //post data(2nd Collection)
  app.post("/addReview", (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview).then((result) => {
      //  console.log('inserted Count:',result.insertedCount)
      res.send(result.insertedCount > 0);
    });
  });

  //   client.close();
});

//port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
