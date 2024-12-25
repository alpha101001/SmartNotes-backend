// import express from 'express';
// import { authMiddleware } from '../Middlewares/AuthValidation.ts';
// import {
//   createImage,
//   getImagesByNote,
//   updateImage,
//   deleteImage
// } from '../Controllers/ImageController.ts';
// import {
//   createImageValidation,
//   updateImageValidation
// } from '../Middlewares/ImageValidation.ts';
// const router = express.Router();
// // CREATE image (with validation)
// router.post('/', authMiddleware, createImageValidation, createImage);
// // GET images for a note (optionally filter by fileType, e.g. ?fileType=image)
// router.get('/:noteId', authMiddleware, getImagesByNote);
// // UPDATE image
// // We can provide imageId as param: /images/update/:imageId or /images/:imageId
// // I'll go with /images/:imageId for consistency
// router.put('/:imageId', authMiddleware, updateImageValidation, updateImage);
// // DELETE image
// router.delete('/:imageId', authMiddleware, deleteImage);
// export default router;
