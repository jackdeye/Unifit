// // fileName : server.js 
// // Example using the http module
// const http = require('http');

// // Create an HTTP server
// const server = http.createServer((req, res) => {
//     // Set the response headers
//     res.writeHead(200, { 'Content-Type': 'text/html' });

//     // Write the response content
//     res.write('<h1>Hello, Node.js HTTP Server!</h1>');
//     res.end();
// });

// // Specify the port to listen on
// const port = 3000;

// // Start the server
// server.listen(port, () => {
//     console.log(`Node.js HTTP server is running on port ${port}`);
// });



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://selinasong:gitagrep%21%21@unifitcluster.vqo27pt.mongodb.net/?retryWrites=true&w=majority&appName=UniFitCluster";

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
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// const {MongoClient} = require('mongodb');
// async function main() {
// 	const uri = 'mongodb+srv://selinasong:gitagrep%21%21@unifitcluster.vqo27pt.mongodb.net/?retryWrites=true&w=majority&appName=UniFitCluster';

//     const client = new MongoClient(uri);
//         try {
//             await client.connect();

//             await listDatabases(client);
    
//         } catch (e) {
//             console.error(e);
//         } finally {
//             await client.close();
//         }
// }

// main().catch(console.error);

// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();
 
//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };
 
