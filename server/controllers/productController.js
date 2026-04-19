import { v2 as cloudinary } from "cloudinary"
import Product from "../models/Product.js"

const normalizeDescription = (description = []) => {
    if (Array.isArray(description)) {
        return description.filter(Boolean);
    }

    if (typeof description === "string") {
        return description
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
    }

    return [];
}

// Add Product : /api/product/add
export const addProduct = async (req, res)=>{
    try {
        let productData = JSON.parse(req.body.productData)
        productData.currency = productData.currency || "USD";
        productData.price = Number(productData.price);
        productData.offerPrice = Number(productData.offerPrice);

        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url
            })
        )

        await Product.create({...productData, image: imagesUrl})

        res.json({success: true, message: "Product Added"})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get Product : /api/product/list
export const productList = async (req, res)=>{
    try {
        const products = await Product.find({})
        res.json({success: true, products})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get single Product : /api/product/id
export const productById = async (req, res)=>{
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        res.json({success: true, product})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res)=>{
    try {
        const { id, inStock } = req.body
        await Product.findByIdAndUpdate(id, {inStock})
        res.json({success: true, message: "Stock Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Update Product : /api/product/update
export const updateProduct = async (req, res) => {
    try {
        const { id, name, description, category, price, offerPrice, currency, inStock } = req.body;

        if (!id) {
            return res.json({ success: false, message: "Product id is required" });
        }

        const existingProduct = await Product.findById(id);

        if (!existingProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        const parsedPrice = Number(price);
        const parsedOfferPrice = Number(offerPrice);
        const normalizedDescription = normalizeDescription(description);

        if (!name?.trim()) {
            return res.json({ success: false, message: "Product name is required" });
        }

        if (!category?.trim()) {
            return res.json({ success: false, message: "Category is required" });
        }

        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            return res.json({ success: false, message: "Product price is invalid" });
        }

        if (!Number.isFinite(parsedOfferPrice) || parsedOfferPrice < 0) {
            return res.json({ success: false, message: "Offer price is invalid" });
        }

        if (parsedOfferPrice > parsedPrice) {
            return res.json({ success: false, message: "Offer price cannot exceed product price" });
        }

        if (!["USD", "UGX", "KES"].includes(currency)) {
            return res.json({ success: false, message: "Unsupported currency selected" });
        }

        if (!normalizedDescription.length) {
            return res.json({ success: false, message: "Product description is required" });
        }

        await Product.findByIdAndUpdate(id, {
            name: name.trim(),
            description: normalizedDescription,
            category: category.trim(),
            price: parsedPrice,
            offerPrice: parsedOfferPrice,
            currency,
            inStock: typeof inStock === "boolean" ? inStock : existingProduct.inStock,
        });

        res.json({ success: true, message: "Product Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
