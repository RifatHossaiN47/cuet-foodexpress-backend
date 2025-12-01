const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;

//send mail
const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAIL_SENDING_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAIL_GUN_API_KEY, domain: DOMAIN });
//middleware
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvdpicq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
//dfdf
const database = client.db("BistroDB");
const menu = database.collection("menu");
const review = client.db("BistroDB").collection("reviews");
const carts = client.db("BistroDB").collection("carts");
const usersDB = client.db("BistroDB").collection("users");
const paymentCollection = client.db("BistroDB").collection("paymentCollection");

//jwt middlewares
const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Forbidden Access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Forbidden Access" });
    }

    req.decoded = decoded;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await usersDB.findOne(query);
  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return res.status(403).send({ message: "Forbidden Access!" });
  }
  next();
};

//payment intent
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = parseInt(price * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});

app.post("/payments", async (req, res) => {
  const payment = req.body;
  const paymentResult = await paymentCollection.insertOne(payment);
  const query = {
    _id: {
      $in: payment.cartIds.map((id) => {
        return new ObjectId(id);
      }),
    },
  };
  const deleteResult = await carts.deleteMany(query);
  //send user email about payment confirmation
  const data = {
    from: "Mailgun Sandbox <postmaster@sandbox1d0f4222c6194af4a5d3c78f44a0bc77.mailgun.org>",
    to: "rifat8851@gmail.com",
    subject: "Bistro Boss Order Confirmation",
    text: "Congratulations!Your Order has been confirmed!",
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
  });

  res.send({ paymentResult, deleteResult });
});
app.get("/payments/:email", verifyToken, async (req, res) => {
  const query = { email: req.params.email };
  const result = await paymentCollection.find(query).toArray();
  res.send(result);
});

//jwt related api
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.send({ token });
});

//stats/analysis home
app.get("/admin-stats", verifyToken, verifyAdmin, async (req, res) => {
  const users = await usersDB.estimatedDocumentCount();
  const menuItems = await menu.estimatedDocumentCount();
  const orders = await paymentCollection.estimatedDocumentCount();

  const result = await paymentCollection
    .aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$price",
          },
        },
      },
    ])
    .toArray();
  const revenue = result.length > 0 ? result[0].totalRevenue : 0;
  res.send({
    users,
    menuItems,
    orders,
    revenue,
  });
});

app.get("/order-stats", verifyToken, verifyAdmin, async (req, res) => {
  const result = await paymentCollection
    .aggregate([
      {
        $unwind: "$menuItemIds",
      },
      {
        $lookup: {
          from: "menu",
          localField: "menuItemIds",
          foreignField: "_id",
          as: "menuItems",
        },
      },
      {
        $unwind: "$menuItems",
      },
      {
        $group: {
          _id: "$menuItems.category",
          quantity: { $sum: 1 },
          revenue: { $sum: "$menuItems.price" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          quantity: "$quantity",
          revenue: "$revenue",
        },
      },
    ])
    .toArray();
  res.send(result);
});

//user related api
app.post("/users", async (req, res) => {
  const user = req.body;
  const query = { email: user.email };
  const existingUser = await usersDB.findOne(query);
  if (existingUser) {
    return res.send({ message: "User Already Exists", insertedId: null });
  }
  const result = await usersDB.insertOne(user);
  res.send(result);
});
app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  const result = await usersDB.find().toArray();
  res.send(result);
});
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const query = {
    _id: new ObjectId(id),
  };
  const result = await usersDB.deleteOne(query);
  res.send(result);
});

//user admin dashboard jete check user admin kina
app.get("/user/admin/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ message: "Unauthorized access!" });
  }
  const query = { email: email };
  const user = await usersDB.findOne(query);
  let admin = false;
  if (user) {
    admin = user?.role === "admin";
  }
  res.send({ admin });
});
app.patch("/users/admin/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      role: "admin",
    },
  };
  const result = await usersDB.updateOne(filter, updatedDoc);
  res.send(result);
});

//menu api's
app.post("/menu", verifyToken, verifyAdmin, async (req, res) => {
  const item = req.body;
  const result = await menu.insertOne(item);
  res.send(result);
});
app.get("/menu", async (req, res) => {
  let menudata = await menu.find().toArray();
  res.send(menudata);
});
app.delete("/menu/:id", async (req, res) => {
  const id = req.params.id;

  // Ensure the ID is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ID format" });
  }

  const query = { _id: new ObjectId(id) };
  console.log("Delete Query:", query, "dfdfdf IDD:", id);
  try {
    const result = await menu.deleteOne(query);

    // Log the result to debug
    console.log("Delete Result:", result);

    res.send(result);
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send({ error: "Failed to delete item" });
  }
});
app.get("/menu/:id", async (req, res) => {
  const id = req.params.id;
  const query = {
    _id: new ObjectId(id),
  };
  const result = await menu.findOne(query);
  res.send(result);
});
app.patch("/menu/:id", async (req, res) => {
  const item = req.body;
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      name: item.name,
      category: item.category,
      price: item.price,
      recipe: item.recipe,
      image: item.image,
    },
  };
  const result = await menu.updateOne(query, updatedDoc);
  res.send(result);
});

//cart Collection
app.get("/carts", async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const result = await carts.find(query).toArray();
  res.send(result);
});

app.post("/carts", async (req, res) => {
  let item = req.body;
  let result = await carts.insertOne(item);
  res.send(result);
});

app.delete("/cart/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await carts.deleteOne(query);
  res.send(result);
});

app.get("/review", async (req, res) => {
  let menudata = await review.find().toArray();
  res.send(menudata);
});

app.post("/review", async (req, res) => {
  const item = req.body;
  const result = await review.insertOne(item);
  res.send(result);
});

//dffdf
app.get("/", (req, res) => {
  res.send("boss is sitting");
});

app.listen(port, () => {
  console.log("bistro boss is running");
});
