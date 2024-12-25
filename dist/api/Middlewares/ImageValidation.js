// import Joi from 'joi';
// const createImageValidation = (req, res, next) => {
//     // Validate the request body with the following schema:
//     // { noteId: string, imageUrl: string, fileType: string }
//   const schema = Joi.object({
//    // noteId, imageUrl, and fileType are required
//     noteId: Joi.string().required(),
//     imageUrl: Joi.string().uri().required(),
//     fileType: Joi.string()
//       .valid('image', 'video', 'pdf', 'doc', 'docx', 'xls', 'xlsx')
//       .required() // only allow valid file types
//   });
//   const { error } = schema.validate(req.body);
//   if (error) {
//     return res.status(400).json({
//       message: 'Bad Request',
//       success: false,
//       error: error.details[0].message
//     });
//   }
//   // if no error, continue to the next middleware
//   next();
// };
// const updateImageValidation = (req, res, next) => {
//   // We only allow updating fileType or imageUrl
//   const schema = Joi.object({
//    // imageUrl and fileType are optional
//     imageUrl: Joi.string().uri().optional(),
//     fileType: Joi.string()
//       .valid('image', 'video', 'pdf', 'doc', 'docx', 'xls', 'xlsx')
//       .optional()
//   });
//   const { error } = schema.validate(req.body);
//   if (error) {
//     return res.status(400).json({
//       message: 'Bad Request',
//       success: false,
//       error: error.details[0].message
//     });
//   }
//   next();
// };
// export { createImageValidation, updateImageValidation };
