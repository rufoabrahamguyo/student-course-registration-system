import mongoose from "mongoose";

const selectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    selections: [
      {
        course: { type: String, required: true },
        lecturer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Selection", selectionSchema);


