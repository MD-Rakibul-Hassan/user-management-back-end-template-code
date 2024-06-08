const express = require('express')
const cors = require('cors')
const users = require('./users')
const { MongoClient, ServerApiVersion,ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri =
	"mongodb+srv://mdrakibulhassan2425:CmaSfu6ZA1cgSmED@cluster0.s3py8lp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();

		const database = client.db('usersDB');
		const usersCalloction = database.collection('userCalloction');

		app.get('/user', async (req, res) => {
			const cursor = usersCalloction.find();
			const result = await cursor.toArray();
			res.send(result)
		})

		app.get('/user/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await usersCalloction.findOne(query)
			res.send(result)
		})

		app.post("/post", async (req, res) => {
			const newUser = req.body;
			const result = await usersCalloction.insertOne(newUser)
			res.send(result)
		});

		app.put('/user/:id', async (req, res) => {
			const id = req.params.id;
			const user = req.body;
			const filter = { _id: new ObjectId(id) }
			const options = { upsert: true }
			const updatedUser = {
				$set: {
					name: user.name,
					email: user.email
				}
			}
			const result = await usersCalloction.updateOne(filter, updatedUser, options)
			res.send(result)
		})

		app.delete('/user/:id', async (req, res) => {
			const id = req.params.id;
			console.log(id)
			const query = { _id: new ObjectId(id) }
			const result = await usersCalloction.deleteOne(query);
			res.send(result)
		})




		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Data is working')
})




app.listen(port, () => console.log('The server is running in port', port))