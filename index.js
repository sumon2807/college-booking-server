const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config()
const port=process.env.PORT || 3000;


//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.CB_USER}:${process.env.CB_PASSWORD}@cluster0.xj518fd.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection
    const collegeCollection=client.db('collegeDB').collection('colleges')

    app.get('/colleges', async(req, res)=>{
        const result=await collegeCollection.find().toArray();
        res.send(result);
    })

    app.get('/colleges/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: { college_image: 1, college_name: 1, college_rating: 1, description: 1, event: 1, event_details: 1, college_rating: 1, sports: 1 }
      }
      const result= await collegeCollection.findOne(query, options)
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('college is running')
})

app.listen(port, ()=>{
    console.log(`college is running on port: ${port}`);
})