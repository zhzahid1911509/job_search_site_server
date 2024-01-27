const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4050;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egki16d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobCollection = client.db('jobSearchDb').collection('allJobs');
    const userCollection = client.db('jobSearchDb').collection('users');

    app.get('/jobs', async (req, res) => {
        const cursor = jobCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/job/:id', async (req, res) => {
        const jobId = req.params.id;
        const query = {_id: new ObjectId(jobId)};
        const result = await jobCollection.findOne(query);
        res.send(result);
      })

      app.post('/addJob', async (req, res) => {
        const newJob = req.body;
        console.log(newJob);
        const result = await jobCollection.insertOne(newJob);
        res.send(result);
      })

      app.post('/addUser', async (req, res) => {
        const newUser = req.body;
        console.log(newUser);
        const result = await userCollection.insertOne(newUser);
        res.send(result);
      })

      app.delete('/deleteJob/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await jobCollection.deleteOne(query);
        console.log(result);
        res.send(result);
      })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('job search site is running')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})