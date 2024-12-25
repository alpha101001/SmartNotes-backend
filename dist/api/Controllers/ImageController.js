// import { Request, Response } from 'express';
// import NoteModel from '../models/Note.ts';
// import ImageModel from '../models/Image.ts';
// /**
//  * CREATE IMAGE
//  * POST /images
//  */
// export const createImage = async (req, res) => {
//   try {
//     // user info attached by authMiddleware
//     const userId = req.user._id;
//     const { noteId, imageUrl, fileType } = req.body;
//     // check if note belongs to the user
//     const note = await NoteModel.findOne({ _id: noteId, userId });
//     if (!note) {
//       return res.status(400).json({
//         message: 'Note not found or does not belong to you',
//         success: false
//       });
//     }
//     // create the image record
//     const newImage = new ImageModel({
//       noteId,
//       userId,
//       imageUrl,
//       fileType
//     });
//     await newImage.save();
//     await NoteModel.findByIdAndUpdate(noteId, {
//       $push: { images: newImage._id }
//     });
//     return res.status(201).json({
//       message: 'Image stored successfully',
//       success: true,
//       data: newImage
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: 'Internal Server Error',
//       success: false,
//       error
//     });
//   }
// };
// /**
//  * GET IMAGES (by noteId) with filter, sorting, pagination
//  * GET /images/:noteId?fileType=<type>&page=<page>&limit=<limit>
//  */
// export const getImagesByNote = async (req, res) => {
//   try {
//    // user info attached by authMiddleware
//     const userId = req.user._id;
//     // noteId from the URL params
//     const { noteId } = req.params;
//     // optional filter in query: ?fileType=image
//     const fileType = req.query.fileType as string | undefined;
//     // pagination params
//     const page = parseInt(req.query.page as string) || 1;  // default page=1
//     const limit = parseInt(req.query.limit as string) || 5; // default limit=5
//     const skip = (page - 1) * limit; // calculate the offset
//     // check if note belongs to the user
//     const note = await NoteModel.findOne({ _id: noteId, userId });
//     if (!note) {
//       return res.status(404).json({
//         message: 'Note not found or does not belong to you',
//         success: false
//       });
//     }
//     // build query
//     const query: any = { noteId, userId };
//     // add fileType filter if provided
//     if (fileType) {
//       query.fileType = fileType;
//     }
//     // fetch images with filter, sorted by createdAt DESC, and pagination
//     const [images, totalCount] = await Promise.all([
//       ImageModel.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit),
//       ImageModel.countDocuments(query)
//     ]);
//     // total pages
//     const totalPages = Math.ceil(totalCount / limit);
//     return res.status(200).json({
//       message: 'Images fetched successfully',
//       success: true,
//       data: {
//         images,
//         pagination: {
//           page,
//           limit,
//           totalPages,
//           totalCount
//         }
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: 'Internal Server Error',
//       success: false,
//       error
//     });
//   }
// };
// /**
//  * UPDATE IMAGE
//  * PUT /images/:imageId
//  */
// export const updateImage = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { imageId } = req.params;
//     const { imageUrl, fileType } = req.body;
//     // check if the image is owned by the user
//     const image = await ImageModel.findOne({ _id: imageId, userId });
//     if (!image) {
//       return res.status(404).json({
//         message: 'Image not found or does not belong to you',
//         success: false
//       });
//     }
//     // update only the fields provided
//     if (imageUrl !== undefined) {
//       image.imageUrl = imageUrl;
//     }
//     // only allow valid file types
//     if (fileType !== undefined) {
//       image.fileType = fileType;
//     }
//     await image.save();
//     return res.status(200).json({
//       message: 'Image updated successfully',
//       success: true,
//       data: image
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: 'Internal Server Error',
//       success: false,
//       error
//     });
//   }
// };
// /**
//  * DELETE IMAGE
//  * DELETE /images/:imageId
//  */
// export const deleteImage = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { imageId } = req.params;
//     // check if the image is owned by the user
//     const image = await ImageModel.findOne({ _id: imageId, userId });
//     if (!image) {
//       return res.status(404).json({
//         message: 'Image not found or does not belong to you',
//         success: false
//       });
//     }
//     // remove it from the database
//     await ImageModel.deleteOne({ _id: imageId });
//     // send the response
//     return res.status(200).json({
//       message: 'Image deleted successfully',
//       success: true
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: 'Internal Server Error',
//       success: false,
//       error
//     });
//   }
// };
