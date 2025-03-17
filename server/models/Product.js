// import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// const productSchema = new mongoose.Schema({
//     id: { type: String, default: uuidv4, unique: true }, // Explicit ID field
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     originalPrice:{ type: Number},
//     images: { type: [String], required: true },
//     category: { type: String, required: true },
//     sizes: { type: [String], required: true },
//     color: { type: String, required: true },
//     isNew: { type: Boolean, default: false },
//     isFeatured: { type: Boolean, default: false },
//     stock: { type: Number, required: true },
// });

// export default mongoose.model("Product", productSchema);



import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const productSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true }, // Explicit ID field
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    images: { type: [String], required: true },
    category: { type: String, required: true },
    isNew: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    variations: [{
        size: { type: String, required: true },
        color: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 }
    }],

    //stock: { type: Number, required: true },
    color: { type: String },
    sizes: { type: [String], required: true },

});

export default mongoose.model("Product", productSchema);
