const {Router} = require("express")
let {notes, category} = require('../repositories/data')
const bodyParser = require("body-parser")
const {postSchema, patchSchema} = require("../services/validation")


const router = Router()
let urlencodedParser = bodyParser.urlencoded({extended: false})



router.get('/', (req, res) => {
    try{
        res.json({notes})
    }catch(e){
        res.status(500).json({message:"Что-то пошло не так"})
    }
})

router.get('/stats', (req, res) => {
    try{
        category.forEach(item => {
            item.activeCount=0
            item.archiveCount=0
        })
        notes.forEach(item => {
            if(!item.archived){
                item.category.activeCount++
            }
            if(item.archived){
                item.category.archiveCount++
            }
        })
        res.json({category})
    }catch(e){
        res.status(500).json({message:"Что-то пошло не так"})
    }
})

router.get('/:id', (req, res) => {
    try{
        const id = req.params.id
        const note = notes.find(note => note.id == id)
        if(note){
            return res.json({note: note})
        }
        res.json({message: `There are no notes with ID = ${id}`})
    }catch(e){
        res.status(500).json({message:"Что-то пошло не так"})
    }
})

router.post('/', urlencodedParser, (req, res) => {
    try{
        postSchema.isValid(req.body)
        .then(function (valid) {
            if(valid){
                const note = req.body
                const noteCategory = category.find(cat => cat.name.toUpperCase() == note.category.toUpperCase())
                if(noteCategory){
                    note.category = noteCategory
                }
                else{
                    return res.status(400).json({message: "Недопустимая категория"})
                }
                note.id = Date.now()
                note.created = new Date()
                notes.push(note)
                return res.status(201).json({message:"Note added", notes})
            }
            return res.status(400).json({message: "Некорректные данные"})
          })

    }catch(e){
        res.status(500).json({message:"Что-то пошло не так"})
    }
})

router.delete('/:id', (req, res) => {
    try{
        const id = req.params.id
        const length = notes.length
        notes = notes.filter(note => note.id != id)
        if(length === notes.length){
            return res.json({message: `There are no notes with ID = ${id}`, notes})
        }
        res.status(202).json({message: `Note with id = ${id} deleted`, notes})
    }catch(e){
        res.status(500).json({message:"Что-то пошло не так"}) 
    }

})
router.patch('/:id', (req, res) => {
    try{
        patchSchema.isValid(req.body)
        .then(function (valid) {
            if(valid){
                const id = req.params.id
                if(!notes.find(note => note.id == id)){
                    return res.json({message: `There are no notes with ID = ${id}`, notes})
                }
                const editNote = req.body
                const noteCategory = category.find(cat => cat.name.toUpperCase() == editNote.category.toUpperCase())
                if(noteCategory){
                    editNote.category = noteCategory
                }
                else{
                    return res.status(400).json({message: "Недопустимая категория"})
                }
                notes = notes.map(note => {
                    return note.id == id ? editNote : note
                })
                return res.status(201).json({message:"Note edited", notes})
            }
            return res.status(400).json({message: "Некорректные данные"})
          })
    }catch(e){
        res.status(500).json({message:"Что-то пошло не так"}) 
    }
})

module.exports = router