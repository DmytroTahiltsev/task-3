const yup = require("yup")

let postSchema = yup.object().shape({
    name: yup.string().required(),
    content: yup.string().required(),
    category: yup.string().required(),
    archived: yup.boolean().required()
})
let patchSchema = yup.object().shape({
    name: yup.string(),
    content: yup.string(),
    category: yup.string()
})

module.exports.postSchema = postSchema
module.exports.patchSchema = patchSchema