require('dotenv').config();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.post("/create-checkout-session", async (req, res) => {
  const { cart } = req.body;

  const line_items = cart.map(item => ({
    price: item.priceId,
    quantity: item.qty,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      success_url: 'https://yoursite.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yoursite.com/cart',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
