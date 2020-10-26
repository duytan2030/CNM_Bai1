const Router = require('express').Router();
const upload = require('../middleware/fileupload');
const dotenv = require('dotenv');
dotenv.config();
//aws
const AWS = require('aws-sdk');
AWS.config.update({ 
    accessKeyId: process.env.AccessKey, 
    secretAccessKey: process.env.SecretKey, 
    region: process.env.region});
const docClient = new AWS.DynamoDB.DocumentClient();

// const bodyParser = require('body-parser');
// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
// // parse application/json
// app.use(bodyParser.json({ extended: true }))

Router.get('/addNew',(req,res)=>{
    return res.render('add');
})
Router.post('/addNew',upload.array('image',1), (req, res) => {
    const student = {
        TableName: "Students",
        Item: {
            "id": req.body.id,
            "StudentID": req.body.StudentID,
            "StudentName": req.body.StudentName,
            "ClassID": req.body.ClassID,
            "birthDay": req.body.birthDay,
            "image": req.file
        }
    };
    docClient.put(student, (err, data) => {
        if (err) {
            return res.status(400).send({ message: err });
        } else {
            return res.redirect('getAll');
        }
    });
});
//get
Router.get('/getOne/:id&:StudentID', (req, res) => {
    var params = {
        TableName: "Students",
        Key: {
            "StudentID": req.params.StudentID,
            "id": req.params.id
        }
    };
    docClient.get(params, (err, data) => {
        if (err) {
            return res.status(400).send({ message: err });
        } else {
            return res.render("edit",{data:data.Item});
        }
    });
});
Router.get('/getOneDetail/:id&:StudentID', (req, res) => {
    var params = {
        TableName: "Students",
        Key: {
            "StudentID": req.params.StudentID,
            "id": req.params.id
        }
    };
    docClient.get(params, (err, data) => {
        if (err) {
            return res.status(400).send({ message: err });
        } else {
            return res.render("detail",{data:data.Item});
        }
    });
});
//update
Router.post('/update',upload.array('image',1) ,async (req, res) => {

    var user = {
        TableName: "Students",
        Key: {
            "StudentID": req.body.StudentID,
            "id": req.body.id
        },
        UpdateExpression: "set StudentName = :s, birthDay=:b, image =:i",
        ExpressionAttributeValues: {
            ":s": req.body.StudentName,
            ":b": req.body.birthDay,
            ":i": req.file
        },
        ReturnValues: "UPDATED_NEW"
    };
    docClient.update(user, function (err, data, next) {
        if (err) {
            return res.status(400).send({ message: err });
        } else {
            return res.redirect("getAll");
        }
    });
});

//delete
Router.get('/delete/:id&:StudentID', (req, res) => {

    var params = {
        TableName: "Students",
        Key: {
            "StudentID": req.params.StudentID,
            "id": req.params.id
        }
        ,
        ConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": req.params.id
        }
    };
    docClient.delete(params, function (err, data) {
        if (err) {
            return res.status(400).send({ message: err });
        } else {
            console.log('sucessfully');
            return res.redirect('/api/getAll');
        }
    });
});
//get all
Router.get('/getAll',  (req, res) => {
    var params = {
        TableName: "Students",
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            return res.status(400).send({ message: err });
        } else {
            if(data!=null){
                return res.render('index',{data: data.Items});
            }
        }
    }
});
module.exports = Router;