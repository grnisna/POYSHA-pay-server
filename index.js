
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



const uri = "mongodb+srv://poysha_pay:ZsRHFYCpIVJa4UrI@cluster0.abru5.mongodb.net/?retryWrites=true&w=majority";
// const uri = `mongodb://poysha_pay:ZsRHFYCpIVJa4UrI@cluster0-shard-00-00.abru5.mongodb.net:27017,cluster0-shard-00-01.abru5.mongodb.net:27017,cluster0-shard-00-02.abru5.mongodb.net:27017/?ssl=true&replicaSet=atlas-ybe1bj-shard-0&authSource=admin&retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {

    try {
        await client.connect();
        console.log("database connected wow!!!");

        const usersCollection = client.db('poysha_pay').collection('users')

        const sendMoneyCollection = client.db('poysha_pay').collection('sendMoney')

        const transationCollection = client.db('poysha_pay').collection('transation_history')

        //post sendMoney//

        app.post('/users', async (req, res) => {
            const allUsers = req.body;
            const result = await usersCollection.insertOne(allUsers);
            res.send(result)
        })

        app.post('/sendMoney', async (req, res) => {
            const allSendMoney = req.body;
            const result = await sendMoneyCollection.insertOne(allSendMoney);
            res.send(result)
        })

        app.post('/transationHistory', async (req, res) => {
            const allTransation = req.body;
            const result = await transationCollection.insertOne(allTransation);
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