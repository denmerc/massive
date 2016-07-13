var express = require("express");
var app = express();
var http = require('http');
var massive = require("massive");
var faker = require("faker");

/*
{
    "AnnotationId": 46,
    "Title": "pricing 1 note test",
    "Message": "pricing 1 note test",
    "CreateTS": "2016-07-12T18:41:42.919Z",
    "ModifyTS": "2016-07-12T18:41:42.919Z",
    "UserId": 1,
    "AnnotationType": "P",
    "Path": "{\"$type\": \"APLPX.Entity.PricingAnnotationPath, APLPX.Entity\", \"StepId\": 1, \"Target\": {\"$type\": \"APLPX.Entity.PricingResultAnnotationTarget, APLPX.Entity\", \"InternalContext\": \"Results sub step\"}, \"ModuleId\": 1, \"FeatureId\": 1}"
  }
*/


// configure app to use bodyParser()
// this will let us get the data from a POST
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
app.use(jsonParser);
var massiveInstance = massive.connectSync({connectionString : connectionString});

// Set a reference to the massive instance on Express' app:
app.set('db', massiveInstance);
var db = app.get('db');

app.get('/notes/:id', function (req, res) {
  db.PX_Main.Annotation.find({AnnotationId: req.params.id}, function (err, res) {
      console.log(err);
      console.log(res);
  });
});


app.get('/notes', function (req, res) {
  db.PX_Main.Annotation.find({}, function (err, docs) {
      console.log(err);
      res.json(docs);
  });
});

app.post('/notes',  jsonParser, function (req, res) {

    var newAnnotation = {
        Title: req.body.Title,
        Message: req.body.Message,
        UserId: req.body.UserId,
        AnnotationType: req.body.AnnotationType,
        Path: req.body.Path,
        CreateTS: new Date().toJSON(),
        ModifyTS: new Date().toJSON()
    };

    db.PX_Main.Annotation.save(newAnnotation, function (err,doc) {
        
        console.log(err);

        db.PX_Main.Annotation.find({}, function (err, docs) {
            console.log(err);
            res.json(docs);
        });
    });  
    
});

app.put('/notes', jsonParser, function (req, res) {
    var updatedNote = {
        AnnotationId : req.body.AnnotationId,
        Title: req.body.Title,
        Message: req.body.Message,
        UserId: req.body.UserId,
        AnnotationType: req.body.AnnotationType,
        Path: req.body.Path,
        ModifyTS: new Date().toJSON()        
    }
    db.PX_Main.Annotation.save( updatedNote, function (err, resp) {
      console.log(err);
      res.send(resp);
    });
    
});

app.delete('/notes/:id', jsonParser, function (req, res) {
    db.PX_Main.Annotation.destroy( {AnnotationId: req.body.AnnotationId}, function (err, resp) {
        console.log(err);
        res.send(resp);
    })
});

http.createServer(app).listen(8080);




