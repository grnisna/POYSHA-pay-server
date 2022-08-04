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
        console.log("database connected wow!!!");
        //add Money Collection
        const addMoneyCollection = client.db('poysha_pay').collection('addMoney');
        const transactionHistoryCollection = client.db('poysha_pay').collection('transaction_history');



        //visualize add Money all transactions
        app.get('/addMoneyTransactions', async (req, res) => {
            const query = {};
            const cursor = addMoneyCollection.find(query);
            const addMoney = await cursor.toArray();
            res.send(addMoney)
        })


        //send add money data to backend from ui
        app.post('/addMoney', async (req, res) => {
            const addMoney = req.body;
            const result = await addMoneyCollection.insertOne(addMoney);
            res.send(result)
        })
        app.post('/transaction_history', async (req, res) => {
            const transactionHistory = req.body;
            const result = await transactionHistoryCollection.insertOne(transactionHistory);
            res.send(result)
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