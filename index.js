const { MongoClient, ServerApiVersion, ObjectId, OrderedBulkOperation } = require('mongodb');
const express = require('express');
const cors = require(`cors`);
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// middlewires
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.fczblwv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      const serviceCollection = client.db(`photoShootCare`).collection(`services`);
      const reviewsCollection = client.db(`photoShootCare`).collection(`reviews`);

      app.get(`/services`, async(req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
      })

      app.get(`/services/:id`, async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await serviceCollection.findOne(query);
        res.send(result);
      })


      // reviews api

      app.post(`/reviews`, async(req, res) => {
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        res.send(result);
      })

      app.get(`/reviews/:id`, async(req, res) => {
        const id = req.params.id;
        const query = {service_id: id};
        const cursor = reviewsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      })

      app.get(`/reviews`, async(req, res) => {
        let query = {};
        console.log(req.query.email)
        if(req.query.email) {
          query = {
            email: req.query.email
          }
        }
        const cursor = reviewsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      })

      app.delete(`/reviews/:id`, async(req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id)};
        const result = await reviewsCollection.deleteOne(query);
        res.send(result); 
      })

      // app.patch(`/reviews/:id`, async(req, res) => {
      //   const id = req.params.id;
      //   const query = { _id: ObjectId(id)};
      //   const updatedDoc = {
      //     $set{
            
      //     }
      //   }
      //   const result = await reviewsCollection.updateOne(query);
      //   res.send(result);
      // })

    }
    finally{

    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})