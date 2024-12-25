// import mongoose from 'mongoose';
// const { Schema } = mongoose;
// const allowedFileTypes = [
//   'image',
//   'video',
//   'pdf',
//   'doc',
//   'docx',
//   'xls',
//   'xlsx' // you can add more if needed
// ];
// const imageSchema = new Schema({
//    // noteId is the ID of the note to which the image is attached
//   noteId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Note',
//     required: true
//   },
//   // userId is the ID of the user who uploaded the image
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   // imageUrl is the URL of the image
//   imageUrl: {
//     type: String,
//     required: true
//   },
//    // fileType is the type of the file (image, video, pdf, etc.)
//   fileType: {
//     type: String,
//     enum: allowedFileTypes,
//     required: true
//   },
//    // createdAt field to store the timestamp when the image was uploaded
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });
// const ImageModel = mongoose.model('Image', imageSchema);
// export default ImageModel;
