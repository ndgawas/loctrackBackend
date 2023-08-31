const mongoose = require("mongoose");
const { Schema } = mongoose;

const CordsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cords", CordsSchema);
