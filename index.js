const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json());

//Username:poysha_pay
//password:ZsRHFYCpIVJa4UrI


const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.abru5.mongodb.net:27017,cluster0-shard-00-01.abru5.mongodb.net:27017,cluster0-shard-00-02.abru5.mongodb.net:27017/?ssl=true&replicaSet=atlas-ybe1bj-shard-0&authSource=admin&retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {

    try {
        await client.connect();
        const transactionHistory = client.db("poysha_pay").collection("transaction_history");
        const AddedAccounts = client.db("poysha_pay").collection("Added_Accounts");

        app.get('/transactionHistory', async (req, res) => {
            const query = {}
            const cursor = transactionHistory.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        //added any account to user database

        app.get('/addedAccount', async (req, res) => {
            const accounts = await AddedAccounts.find({}).toArray();
            res.send(accounts)

            // const query = {}
            // const cursor = AddedAccounts.find(query);
            // const result = await cursor.toArray();
            // res.send(result);
        })

        app.post('/addedAccount', async (req, res) => {
            const data = req.body;
            const addedAccount = await AddedAccounts.insertOne(data)
            res.send(addedAccount);
        })

    } finally {

    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello BoroLoks!!!!')
})

app.listen(port, () => {
    console.log(`Poysha Pay App is ready to transaction on port ${port}`)
})