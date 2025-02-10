const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [
      'http://localhost:3000',
    ],
    credentials: true
  }));
  app.use(express.json());






  const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wj0pjif.mongodb.net/?retryWrites=true&w=majority`;
  
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
      const projectsCollection = client.db("portfolioDB").collection("projects");
      const blogCollection = client.db("portfolioDB").collection("blogs");
      await client.connect();
  
  

          // API routes for projects
    app.get('/projects', async (req, res) => {
      try {
        const result = await projectsCollection.find().toArray();
        res.status(200).send(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Blog APIs

    // Create Blog
    app.post("/blogs", async (req, res) => {
      try {
        const newBlog = req.body; // Assuming the blog data is passed directly in the request body
        const result = await blogCollection.insertOne(newBlog);
        res.status(201).json(result.ops[0]); // Return the created blog
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get All Blogs
    app.get("/blogs", async (req, res) => {
      try {
        const blogs = await blogCollection.find().toArray();
        res.status(200).json(blogs);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get Single Blog by ID
    app.get("/blogs/:id", async (req, res) => {
      try {
        const blog = await blogCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!blog) {
          return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(blog);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Update Blog
    app.put("/blogs/:id", async (req, res) => {
      try {
        const updatedBlog = await blogCollection.findOneAndUpdate(
          { _id: new ObjectId(req.params.id) },
          { $set: req.body },
          { returnDocument: 'after' } // This returns the updated document
        );
        if (!updatedBlog.value) {
          return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(updatedBlog.value);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
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
  
  
  
  // Sample route and controller
  app.get('/', (req, res) => {
    res.send('portfolio API is running');
  });
  
  app.listen(port, () => {
    console.log(`portfolio API is running on port: ${port}`);
  });
  