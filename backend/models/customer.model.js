import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId, // storing object id instead of whole product database remains normalized 
      ref: 'Product'
    }
  ],
}, { timestamps: true })

export const Customer = mongoose.model("Customer", customerSchema)