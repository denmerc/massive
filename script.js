
var massive = require("massive");

var faker = require("faker");


massive.connect({
  connectionString: connectionString}, function(err, db){

    var note = {

    "Title": "pricing dmac updated note test",
    "Message": "pricing 5 updated note test",
    "CreateTS": "2016-07-13T01:41:42.919Z",
    "ModifyTS": "2016-07-13T06:29:49.425Z",
    "UserId": 5,
    "AnnotationType": "R",
    "Path": 
        {
         "$type": "APLPX.Entity.PricingAnnotationPath, APLPX.Entity",
         "StepId": 1, 
         "ModuleId": 1, 
         "FeatureId": 1,
         "Target": 
                {
                    "$type": "APLPX.Entity.PricingResultAnnotationTarget, APLPX.Entity",
                    "InternalContext": "Results sub step"
                }, 
        }
    }

    var note2 = {

    "Title": faker.lorem.sentence(),
    "Message": faker.lorem.paragraphs(),
    "CreateTS": "2016-07-13T01:41:42.919Z",
    "ModifyTS": "2016-07-13T06:29:49.425Z",
    "UserId": 5,
    "AnnotationType": "R",
    "Path": "{\"$type\": \"APLPX.Entity.PricingAnnotationPath, APLPX.Entity\", \"StepId\": 1, \"Target\": {\"$type\": \"APLPX.Entity.PricingResultAnnotationTarget, APLPX.Entity\", \"InternalContext\": \"Results sub step\"}, \"ModuleId\": 1, \"FeatureId\": 1}"
    }

    db.PX_Main.Annotation.save(note, function (err,docs) {
        if (err) {console.log(err);}
        if (docs) {console.log(docs);}

    });  

});


