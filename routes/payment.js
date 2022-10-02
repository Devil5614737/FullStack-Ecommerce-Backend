const dotenv=require('dotenv')
const express = require("express");
const router = express.Router();
const products = require("../data/products");

dotenv.config({path:'./.env'})

var Secret_Key =process.env.SECRET_KEY

const stripe = require("stripe")(Secret_Key);

router.post("/create-checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "usd",
            object:"price",
            billing_scheme:"per_unit",
            product_data: {
              name: item.title,
            },
            unit_amount: item.price,
            
          },
          quantity: item.quantity,
          
        };
      }),
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cart",
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
