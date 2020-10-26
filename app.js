const express= require('express');
const cors = require('cors')
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(cors());
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json({ extended: true }))
const upload = require('./middleware/fileupload');
const studentRoute = require('./Router/student.route');
app.use('/api',studentRoute);
app.listen(3000,()=>{
    console.log('server connect port 3000');
});
app.get('*',(req, res)=>{
    res.render('trangchu');
})