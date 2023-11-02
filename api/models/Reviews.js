import mongoose from "mongoose";

const reviewsSchema = mongoose.Schema(
  {
    rating: {
      type: NUmber,
      required: true,
      default: 0,
    },
    review: {
      type: String,
      required: true,
    },
    // customer: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Customer",
    // },
    status: {
      type: Boolean,
      default: true,
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewsSchema);
