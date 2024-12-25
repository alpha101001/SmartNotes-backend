import mongoose from 'mongoose';
const Schema = mongoose.Schema;
export interface IFileSubdoc {
   fileName: string;
   fileUrl: string;
   fileType: string;
 }
 export interface INote extends Document {
   title: string;
   content: string;
   isPinned: boolean;
   files: IFileSubdoc[]; // or Mongoose subdocuments
   userId: mongoose.Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
 }

// highlight: we no longer reference an external image model.
// Instead, we embed an array of file objects right here
// { fileName, fileUrl, fileType }
const fileSchema = new Schema({
   fileName: { type: String, required: true },
   fileUrl: { type: String, required: true },
   fileType: { type: String, required: true } // e.g., 'image', 'pdf', 'docx', etc.
 });
const noteSchema = new Schema({
   // Define the schema for a note
   // title of the note
  title: {
    type: String,
    required: true
  },
  // content of the note (can be a markdown formatted string)
  content: {
    type: String,
    required: true
  },
  // isPinned is a boolean to determine if the note is pinned to the top or not
  isPinned: {
    type: Boolean,
    default: false
  },
  files: [fileSchema],
   // userId is the ID of the user who created the note
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
   // createdAt and updatedAt fields to store timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  // updatedAt field to store the last time the note was updated
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a text index on title and content for efficient searching
noteSchema.index({
   title: 'text',
   content: 'text',
   'files.fileName': 'text'
 });

const NoteModel = mongoose.model<INote>('Note', noteSchema);
export default NoteModel;
