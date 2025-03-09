import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    duration: Number,
    instructor: String
});

const Course = mongoose.model("courses", courseSchema);
export default Course;