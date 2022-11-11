const { MongoClient, ServerApiVersion, ObjectId, OrderedBulkOperation } = require('mongodb');
const express = require('express');
const cors = require(`cors`);
const app = express();
const jwt = require(`jsonwebtoken`);
require('dotenv').config()
const port = process.env.PORT || 5000;

// middlewires
app.use(cors())
app.use(express.json())

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
// }) 


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.fczblwv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// function verifyJWT(req, res, next){
//   const authHeader = req.headers.authorization;
//   if(!authHeader){
//     return send.status(401).send({message: `Unauthorized Access`})
//   }
//   const token = authHeader.split(` `)[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//     if(err){
//       return send.status(401).send({message: `Unauthorized Access`})
//     }
//     req.decoded = decoded;
//     next();
//   })
// }



// function verifyJWT(req, res, next){
//   const authHeader = req.headers.authorization;
//   if(!authHeader){
//     return res.status(401).send(`unauthorized access`);
//   }
//   const token = authHeader.split(` `)[1];
// }

// function verifyJWT(req, res, next){
//   const authHeader = req.headers.authorization;
//   if(!authHeader){
//     return res.status(401).send(`unauthorized access`);
//   }
//   const token = authHeader.split(` `)[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//     if(err){
//       return res.status(403).send(`unauthorized access`);
//     }
//     req.decoded = decoded;
//   })
// }

// function verifyJWT(req, res, next){
//   const authHeader = req.headers.authoriztion;
//   if(!authHeader){
//     return res.status(401).send(`unauthorized access`);
//   }
//   // const token = authHeader.split(` `)[1];
//   // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, functon(er, decoded){
//   //   return res.status(401)
//   // })
//   const token = authHeader.split(` `)[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//     if(err){
//       return res.status(401).send({message: `unauthorized access`});
//     }
//     res.decoded = decoded;
//     next();
//   })
// }


// function verifyJWT(req, res, next){
//   const authHeader = req.headers.authoriztion;
//   if(!authHeader){
//     return res.status(401).send({message: `unauthrized access`})
//   }
//   const token = authHeader.split(` `)[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//     if(err){
//       return res.status(401).send({message: `unauthorized access`})
//     }
//     res.decoded = decoded;
//     next();
//   })
// }


// function verifyJWT(req, res, next){
//   const authHeader = req.headers.authoriztion;
//   if(!authHeader){
//     return res.status(401).send({message: `unauthorized access`})
//   }
//   const token = authHeader.split(` `)[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//     if(err){
//       return res.status(401).send({message: `unauthorized access`});
//     }
//     res.decoded = decoded;
//     next();
//   })
// }


// function verifyJWT(req, res, next){
//   const authToken = req.headers.authoriztion;
//   if(!authToken){
//     return res.status(401).send({message: `unauthorized access`})
//   }
//   const token = authToken.split(` `)[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//     if(err){
//       return res.status(403).send({message: `unauthorized access`})
//     }
//     res.decoded = decoded;
//     next();
//   })
// }


function verifyJWT(req, res, next){
  const authHeader = req.heasers.authorization;
  if(!authHeader){
    return res.status(401).send({message: `unathorized access`})
  }
  const token = authHeader.split(` `)[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
    if(err){
      return res.status(403).send({message: `unauthorized acce3ss`});
    }
    res.decode = decoded;
    next();
  })
}



async function run(){
    try{
      const serviceCollection = client.db(`photoShootCare`).collection(`services`);
      const reviewsCollection = client.db(`photoShootCare`).collection(`reviews`);


      // // jwt api

      // app.post(`/jwt`, (req, res) => {
      //     const user = req.body;
      //     console.log(user);
      //     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: `1hr`})
      //     res.send({token});
      // })

      app.post(`/jwt`, (req, res) => {
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2h'});
        res.send({token});
      })




      // services api

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

      app.post(`/services`, async(req, res) => {
        const service = req.body;
        const result = await serviceCollection.insertOne(service);
        res.send(result);
      })


      app.get(`/services`,   async(req, res) => {
        let query = {};
        console.log(req.query.email)
        if(req.query.email) {
          query = {
            email: req.query.email
          }
        }
        const cursor = serviceCollection.find(query);
        const result = await cursor.toArray();
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
        // const decoded = req.decode;
        // if(decoded.email !== req.query.email){
        //   return res.status(403).send({message: `unauthorized access`});
        // }

        const decode = req.decode;
        // if(decode.email !== req.query.email){
        //   return res.status(403).send({message: `access unauthorized`});
        // }


        // console.log(`inside request api`, decoded);

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