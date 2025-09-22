import reviewModel from "../models/reviewsModel.js";

// ✅ Add Review
export const addReview = async (req, res) => {
  try {
    const { name, rating, comment, productId } = req.body;

    if (!name || !rating || !comment || !productId) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const review = new reviewModel({
      name,
      rating,
      comment,
      product: productId,
    });

    await review.save();

    res.json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Reviews for Product
export const getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Review
export const deleteReview = async (req, res) => {
  try {
    await reviewModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const updateReview = async (req, res) => {
  try {
    const { name, rating, comment, productId } = req.body;
    const review = await reviewModel.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    review.name = name || review.name;
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.product = productId || review.product;

    await review.save();
    res.json({ success: true, message: "Review updated successfully", review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};




export const allReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find().populate("product", "name"); 
    // "product" = field in review schema
    // "name" = only fetch name field from Product model
    res.json({ success: true, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

