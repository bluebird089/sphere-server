const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cq5lj6.mongodb.net/?retryWrites=true&w=majority`;
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

        const productsCollection = client.db('sphereDB').collection('products');
        const cartCollection = client.db('sphereDB').collection('cart');

        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Getting Products by brand name
        app.get('/products/:brand', async (req, res) => {
            const brandName = req.params.brand;
            const query = { brandName: (brandName) };
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        });

        // Getting Products by id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        });

        // Update Products by id
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedProducts = req.body;
            const updateProduct = {
                $set: {
                    photo: updatedProducts.photo,
                    name: updatedProducts.name,
                    brandName: updatedProducts.brandName,
                    type: updatedProducts.type,
                    price: updatedProducts.price,
                    description: updatedProducts.description,
                    rating: updatedProducts.rating,
                }
            }
            const result = await productsCollection.updateOne(filter, updateProduct, options);
            res.send(result);
        });

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await cartCollection.insertOne(newProduct);
            res.send(result);
        });

        // Cart DB
        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/cart', async (req, res) => {
            const newProduct = req.body;
            const result = await cartCollection.insertOne(newProduct);
            res.send(result);
        });

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('Server Running');
})

// Listening Port
app.listen(port, () => {
    console.log(`Port is running on ${port}`);
})