import mongoose from "mongoose";

const Schema = mongoose.Schema;

const clientSchema = new Schema({
  firstName : { type: String },
  lastName:{type:String},
  mobileNumber: { type: String },
  email: { type: String },
  country: { type: String },
  city: { type: String },
  state: { type: String },
  password:{type:String},
  role:{type: String, default: "client"},
  
});
export const clientModel = mongoose.model("client", clientSchema, "client");


const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true }, // e.g., Tools, Electrical, Plumbing, etc.
  brand: { type: String },
  sku: { type: String, unique: true, required: true }, // Stock Keeping Unit
  imageUrl: { type: String }, // URL for product image
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "client" }, // Reference to the user who added the product
});

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const productModel = mongoose.model("product", productSchema, "products");