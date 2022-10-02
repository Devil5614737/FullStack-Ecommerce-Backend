const express = require("express");
const router = express.Router();
const data = require("../data/products");
const auth = require("../middleware/auth");
const Order = require("../models/order");

router.get("/", (req, res) => {
  return res.status(200).json(data);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = data.find((item) => item._id === parseInt(id));
  if (!result) return res.json("not found");
  return res.status(200).json(result);
});

router.post("/add-to-cart", auth, async (req, res) => {
  const { title, image, description, price, quantity, category } = req.body;
  const item = new Order({
    title,
    image,
    description,
    price,
    quantity,
    category,
    user: req.user._id,
  });
  try {
    const order = await item.save();
    return res.status(200).json(order);
  } catch (e) {
    return res.status(400).json(error);
  }
});

router.post("/get-cart-item", auth, async (req, res) => {
  const item = await Order.find({
    user: req.user._id,
  }).populate("user", "_id username");

  try {
    res.status(200).json(item);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/remove-item", auth, async (req, res) => {
  Order.findByIdAndDelete(req.body.itemId, {
    new: true,
  }).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});
router.delete("/remove-all", auth, async (req, res) => {
  Order.deleteMany(
    { user: req.user._id },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/increase-quantity", auth, async (req, res) => {
  const qty = req.body.quantity;
  if (qty >= 5) return;
  Order.findByIdAndUpdate(req.body.itemId, {
    $set: {
      quantity: qty + 1,
    },
  }).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});
router.put("/decrease-quantity", auth, async (req, res) => {
  const qty = req.body.quantity;
  if (qty < 1) return;
  Order.findByIdAndUpdate(req.body.itemId, {
    $set: {
      quantity: qty - 1,
    },
  }).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
