const {getDb} = require("../util/database")
const {ObjectId} = require("mongodb");
const {removeTicks} = require("sequelize/lib/utils");


class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart || {items: []}; // { items: [] }
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.prodId.equals(product._id);
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({prodId: product._id, quantity: newQuantity});
    }

    const updateCart = {items: updatedCartItems};
    const db = getDb()
    return db.collection("users").updateOne(
      {_id: this._id},
      {$set: {cart: updateCart}}
    )
  }

  getCart() {
    const db = getDb()
    const productIds = this.cart.items.map(i => {
      return i.prodId;
    })
    return db.collection("products").find({_id: {$in: productIds}}).toArray()
      .then(products => {
        return products.map(p => {
          return {
            ...p, quantity: this.cart.items.find(i => {
              return i.prodId.toString() === p._id.toString()
            }).quantity
          }
        })
      })
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(i => {
      return i.prodId.toString() !== productId.toString();
    })
    const updateCart = {items: updatedCartItems};
    const db = getDb()
    return db.collection("users").updateOne(
      {_id: this._id},
      {$set: {cart: updateCart}}
    )
  }

  addOrder() {
    const db = getDb();
    return this.getCart().then(products => {
      const order = {
        items: products,
        user: {
          _id: this._id,
          username: this.username
        }
      };
      return db.collection("orders").insertOne(order);
    })
      .then(result => {
        this.cart = {items: []};
        return db.collection("users").updateOne(
          {_id: this._id},
          {$set: {cart: {items: []}}}
        )
      })
  }

  getOrders() {
    const db = getDb();
    return db.collection("orders").find({"user._id": this._id}).toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({_id: new ObjectId(userId)})
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
