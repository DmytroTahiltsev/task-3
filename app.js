const express = require('express')
const path=require('path')

const PORT = process.env.PORT || 5000
const app= express()
app.use(express.json({extended: true}))
app.use('/notes', require("./routes/notes.routes"))


const start= async()=>{
    try{
        app.get('/', (req, res) => {
            res.json({message:'notes'})
        })
        app.listen(PORT, ()=> console.log(`server has been started on PORT ${PORT}`))
    }catch(e){
        console.log(e)
    }
}
start()  