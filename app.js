const express = require('express')
const path=require('path')
const {notes, category} = require('./data')

const PORT = process.env.PORT || 5000





const app= express()
app.use(express.json({extended: true}))
app.use(express.static(path.resolve(__dirname, 'client')))
app.use('/notes', require("./routes/notes.routes"))
app.set('view engine', 'ejs')

const start= async()=>{
    try{
        app.get('/', (req, res) => {
            //res.render('index')
            res.json({message:'notes', notes: notes})
        })
        app.listen(PORT, ()=> console.log(`server has been started on PORT ${PORT}`))
    }catch(e){
        console.log(e)
    }
}
start()