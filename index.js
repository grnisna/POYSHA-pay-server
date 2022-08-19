
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json());

//Username:poysha_pay
//password:ZsRHFYCpIVJa4UrI

// //---------varify token --------
// function varifyToken(req, res, next) {
//     const getToken = req.headers.authorization;
//     console.log(getToken);
//     if (!getToken) {
//         return res.status(401).send({ message: 'UnAuthorized' });
//     }
//     const token = getToken.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
//         if (err) {
//             return res.status(403).send({ message: 'Forbidden' });
//         }
//         else {
//             req.decoded = decoded;
//             next();
//         }
//     })
// }



const uri = "mongodb+srv://poysha_pay:ZsRHFYCpIVJa4UrI@cluster0.abru5.mongodb.net/?retryWrites=true&w=majority";
// const uri = `mongodb://poysha_pay:ZsRHFYCpIVJa4UrI@cluster0-shard-00-00.abru5.mongodb.net:27017,cluster0-shard-00-01.abru5.mongodb.net:27017,cluster0-shard-00-02.abru5.mongodb.net:27017/?ssl=true&replicaSet=atlas-ybe1bj-shard-0&authSource=admin&retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {

    try {
        await client.connect();
        const transactionHistory = client.db("poysha_pay").collection("transaction_history");
        const AddedAccounts = client.db("poysha_pay").collection("Added_Accounts");
        const usersCollection = client.db('poysha_pay').collection('users')
        const sendMoneyCollection = client.db('poysha_pay').collection('sendMoney')
        // const transationCollection = client.db('poysha_pay').collection('transation_history')
        const userImageCollection = client.db('poysha_pay').collection('userimages');


        //user
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            console.log("email is", email);
            const query = { email: email };
            const userId = usersCollection.find(query)
            const id = await userId.toArray();
            res.send(id)
        })

        //post sendMoney//

        app.post('/users', async (req, res) => {
            const allUsers = req.body;
            const result = await usersCollection.insertOne(allUsers);
            res.send(result)
        })

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const userInfo = req.body;
            const filter = { email: email };
            const options = { ursert: true };
            const updateUser = {
                $set: { userInfo }
            }

            const result = await usersCollection.updateOne(filter, updateUser, options);
            res.send(result);

        })

        app.post('/sendMoney', async (req, res) => {
            const allSendMoney = req.body;
            const result = await sendMoneyCollection.insertOne(allSendMoney);
            res.send(result)
        })

        // app.post('/transationHistory', async (req, res) => {
        //     const allTransation = req.body;
        //     const result = await transationCollection.insertOne(allTransation);
        //     res.send(result)
        // });

        app.get('/sendMoney', async (req, res) => {
            const query = {};
            const getAllSendmoney = sendMoneyCollection.find(query);
            const sendMoney = await getAllSendmoney.toArray();
            res.send(sendMoney);

        });

        // GET TRANSACTION ALL STATEMENT ;
        // app.get('/transactionStatement', async( req, res) =>{

        // })


        app.post('/userimage', async (req, res) => {
            const userimage = req.body;
            const result = await userImageCollection.insertOne(userimage);
            res.send(result);
        });

        app.get('/userimage', async (req, res) => {
            const userimages = await userImageCollection.find().toArray();
            res.send(userimages);
        })



        //========== AUTHENTICATION =======================
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1d'
            });
            res.send(accessToken);

        })

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
        app.post('/transactionHistory', async (req, res) => {
            const transactionHistory = req.body;
            const result = await transactionHistoryCollection.insertOne(transactionHistory);
            res.send(result)
        })


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
    res.send('Hello BoroLoks !!!!')
})

app.listen(port, () => {
    console.log(`Poysha-pay App is ready to transaction on port ${port}`)
})