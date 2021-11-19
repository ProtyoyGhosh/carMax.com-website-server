const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mja99.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("assignment_12");
        const itemsCollection = database.collection("items")
        const cart_Collection = database.collection("cart");
        const review_Collection = database.collection("review_collection");

        // load all items api
        app.get('/items', async (req, res) => {
            const cursor = itemsCollection.find({});
            const items = await cursor.toArray();
            res.send(items);
        })

        // delete item from items collection 
        app.delete("/deleteItem/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.deleteOne(query);
            // console.log(result);
            res.json(result);
        });

        // load single item api
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemsCollection.findOne(query);
            res.json(item);
        });


        // load cart data according to user id get api
        app.get("/cart/:uid", async (req, res) => {
            const uid = req.params.uid;
            // console.log(uid);
            const query = { uid: uid };
            const result = await cart_Collection.find(query).toArray();
            // console.log(result);
            res.json(result);
        });

        // add data to cart collection with additional info
        app.post("/item/add", async (req, res) => {
            const item = req.body;
            const result = await cart_Collection.insertOne(item);
            // console.log(result.insertedId)
            res.json(result);
        });

        // delete data from cart delete api
        app.delete("/delete/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cart_Collection.deleteOne(query);
            // console.log(result);
            res.json(result);
        });

        // purchase delete api
        app.delete("/purchase/:uid", async (req, res) => {
            const uid = req.params.uid;
            const query = { uid: uid };
            const result = await cart_Collection.deleteMany(query);
            // console.log(result);
            res.json(result);
        });

        // orders get api
        app.get("/orders", async (req, res) => {
            const result = await cart_Collection.find({}).toArray();
            res.json(result);
        });

        // status confirmetion api
        app.put('/confirm/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = {
                $set: {
                    status: 'confirm'
                },
            };
            const result = await cart_Collection.updateOne(query, item);
            res.json(result);
            console.log(result);
        });

        // add package api
        app.post('/addpackage', async (req, res) => {
            const result = await itemsCollection.insertOne(req.body);
            res.send(result.insertedId)
        })


        // load all the reviews api
        app.get('/reviews', async (req, res) => {
            const cursor = review_Collection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // add new review api
        app.post('/addreview', async (req, res) => {
            const result = await review_Collection.insertOne(req.body);
            res.send(result.insertedId)
        })
    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('yoooo assignment 12 !!!')
})


app.listen(port, () => {
    console.log('assignment 12 running on port', port);
})