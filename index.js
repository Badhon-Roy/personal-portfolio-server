const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wj0pjif.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const projectsCollection = client.db("portfolioDB").collection("projects");
    const blogCollection = client.db("portfolioDB").collection("blogs");
    const messagesCollection = client.db("portfolioDB").collection("messages");
    await client.connect();

    // --- Project Management Routes ---
    // Create Project
    app.post("/projects", async (req, res) => {
      try {
        const newProject = req.body;
        const result = await projectsCollection.insertOne(newProject);
        res.status(201).json(result.ops[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get All Projects
    app.get("/projects", async (req, res) => {
      try {
        const projects = await projectsCollection.find().toArray();
        res.status(200).json(projects);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get Project by ID
    app.get("/projects/:id", async (req, res) => {
      try {
        const project = await projectsCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Update Project
    app.put("/projects/:id", async (req, res) => {
      try {
        const updatedProject = await projectsCollection.findOneAndUpdate(
          { _id: new ObjectId(req.params.id) },
          { $set: req.body },
          { returnDocument: 'after' }
        );
        if (!updatedProject.value) {
          return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(updatedProject.value);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Delete Project
    app.delete("/projects/:id", async (req, res) => {
      try {
        const result = await projectsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json({ message: "Project deleted successfully!" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // --- Blog Management Routes ---
    // Create Blog
    app.post("/blogs", async (req, res) => {
      try {
        const newBlog = req.body;
        const result = await blogCollection.insertOne(newBlog);
        res.status(201).json(result.ops[0]);
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
          { returnDocument: 'after' }
        );
        if (!updatedBlog.value) {
          return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(updatedBlog.value);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Delete Blog
    app.delete("/blogs/:id", async (req, res) => {
      try {
        const result = await blogCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json({ message: "Blog deleted successfully!" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // --- Message Management Routes ---
    // Get All Messages
    app.get("/messages", async (req, res) => {
      try {
        const messages = await messagesCollection.find().toArray();
        res.status(200).json(messages);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Send a ping to confirm successful MongoDB connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // client.close(); // Uncomment if you want to close the client connection after the run.
  }
}

run().catch(console.dir);

// Basic route to check if the API is running
app.get('/', (req, res) => {
  res.send('Portfolio API is running');
});

app.listen(port, () => {
  console.log(`Portfolio API is running on port: ${port}`);
});
