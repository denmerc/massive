var express = require("express");
var app = express();
var http = require('http');
var massive = require("massive");
var faker = require("faker");
// var connectionString = "postgres://postgres:Welcome16!@192.168.5.72/postgres";
var connectionString = "postgres://postgres:postgres@lois-fb.apltest.local/postgres";

/*
sample json post
{
    "step": "results",
    "title": "title",
    "message": "message",
    "annotater": "annotater",
    "entitytype" : "entitytype",
    "module" : "module",
    "feature" : "feature",
    "step" : "step",
    "entityid" : "entityid",
    "control" : "control"
}
*/


// configure app to use bodyParser()
// this will let us get the data from a POST
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
//var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(jsonParser);
// app.use(bodyParser.json());

//deprecated?
// app.configure(function () {
//   app.use(express.bodyParser());
//   app.use(express.methodOverride());
  // app.use(app.router);
  // app.use(express.static(path.join(application_root, "public")));
  // app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// });

// connect to Massive and get the db instance. You can safely use the
// convenience sync method here because its on app load
// you can also use loadSync - it's an alias
var massiveInstance = massive.connectSync({connectionString : connectionString})

// Set a reference to the massive instance on Express' app:
app.set('db', massiveInstance);
var db = app.get('db');
app.get('/notes', function (req, res) {
  //  res.send([{name:'wine1'}, {name:'wine2'}]);
  //res.setHeader('Content-Type', 'application/json');

  db.annotations.searchDoc({keys: ["message"], term: "fuga"}, function (err,docs) {
     res.json(docs);
  });
  // res.send(results);
});


// app.delete('/notes/:id', function (req, res) {
//   db.doggies.destroy({id : req.params.id}, function(err,res){
//       console.log(err);
//   });
// });

app.delete('/notes', jsonParser, function (req, res) {
  db.annotations.destroy({id: req.body.id}, function(err,res){
      console.log(err);
      
  });
  res.send(200, 'Successfully deleted note.');
});

app.post('/notes',  jsonParser, function (req, res) {

      //console.log(req.body);



      /*
      AnnotationQuery
      Terms - 'analytic', analyticid, login 
      */

        var newAnnotation = {
            title: req.body.title,
            message: req.body.message,
            annotater: req.body.annotater,
            entitytype: req.body.entitytype,
            module: req.body.module,
            feature: req.body.feature,
            step: req.body.step,
            entityid: req.body.entityid,
            control: req.body.control,
            datecreated: new Date().toJSON()
        };


        db.saveDoc("annotations", newAnnotation, function (err,doc) {
            // var results = db.annotations.find({},{limit:50});
            // res.json(results);
            // res.send(results);

            db.annotations.searchDoc({keys: ["annotater"], term: req.body.annotater}, function (err,docs) {
              console.log(err);
              res.json(docs);
            });


        });  
      });



app.post('/search',  jsonParser, function (req, res) {

        console.log(req.body);

        /*
        AnnotationQuery
        Action
        Terms - 'analytic', analyticid, login 
        */


        db.annotations.searchDoc({keys: [ "title", "entityid", "message", "annotater", "module", "feature", "step" ], term: req.body.terms}, function (err,docs) {
          res.json(docs);
        });
      });






http.createServer(app).listen(8080);




// db.PX_Main.User.find(1, function (err, res) {
//   console.log(res);
// });



// db.createDocumentTable('PX_Main.Annotations', function(err, res) {
//   console.log('created annotations table');
// });

//  for (var index = 0; index < 50; index++) {
  
  
//   var newAnnotation = {
//       title: faker.random.arrayElement(["YB380A", "XV23WH", "XV22", "ZP8306B", "ZP8305B", "XV23WH", "ZP8300S", "ZP830", "ZP09560","ZP06180","ZP06175","Z611000", "Y011AXX", "Y011AXL", "Y011ASM", "Y011AMD", "XV22", "XV22WH", "XP82TL", "XP81PL", "XP51FN", "XP14RD", "XP12RD", "XP13RD", "XP11SW"]) + "-" + faker.lorem.sentence(),
//       message: faker.lorem.sentence() + faker.random.arrayElement(["YB380A", "XV23WH", "XV22", "ZP8306B", "ZP8305B", "XV23WH", "ZP8300S", "ZP830", "ZP09560","ZP06180","ZP06175","Z611000", "Y011AXX", "Y011AXL", "Y011ASM", "Y011AMD", "XV22", "XV22WH", "XP82TL", "XP81PL", "XP51FN", "XP14RD", "XP12RD", "XP13RD", "XP11SW"]) + faker.lorem.sentence() + faker.lorem.sentence() + faker.lorem.sentence() + faker.lorem.sentence() ,
//       annotater: "dennism",
//       entitytype: faker.random.arrayElement(["product"]),
//       // entitytype: faker.random.arrayElement(["analytic", "price routine", "promotion", "kit"]),
//       entityid: faker.random.arrayElement(["YB380A", "XV23WH", "XV22", "ZP8306B", "ZP8305B", "XV23WH", "ZP8300S", "ZP830", "ZP09560","ZP06180","ZP06175","Z611000", "Y011AXX", "Y011AXL", "Y011ASM", "Y011AMD", "XV22", "XV22WH", "XP82TL", "XP81PL", "XP51FN", "XP14RD", "XP12RD", "XP13RD", "XP11SW"]),
//       module: faker.random.arrayElement(["planning", "tracking", "admin", "reporting"]),
//       // feature: faker.random.arrayElement(["analytics", "pricing-everyday", "pricing-promotions", "pricing-kits"]),
//       feature: faker.random.arrayElement(["PlanningHome", "PlanningAnalytics", "PlanningEverydayPricing", "PlanningPromotionPricing", "PlanningKitPricing", "PlanningCompetition", "TrackingHome", "TrackingPerformance", "TrackingComparison", "ReportingHome", "AdminHome", "AdminUsers", "AdminTemplates", "AdminTemplates", "AdminCompetition", "AdminETLForeignKeyErrors"]),
//       // step: faker.random.arrayElement(["identity", "filters", "pricelists", "rules", "keydriver", "influencers", "results", "impactanalysis", "approval"]),
//       step: faker.random.arrayElement(["PlanningHomeDashboard", "PlanningAnalyticsSearch", "PlanningAnalyticsIdentity", "PlanningAnalyticsFilters", "PlanningAnalyticsPriceLists", "PlanningAnalyticsValueDrivers", "PlanningAnalyticsResults", "PlanningPricingSearch", "PlanningPricingIdentity", "PlanningPricingFilters", "PlanningPricingPriceLists", "PlanningPricingRules", "PlanningPricingKeyDriver", "PlanningPricingInfluencers", "PlanningPricingResults", "PlanningPricingImpactAnalysis", "PlanningPricingApproval", "PlanningKitPricingAdjustments"]),
//       control: faker.random.arrayElement(["grid", "panel1", "listbox1"]),
//       datecreated: faker.date.recent()
//   };


//   db.saveDoc("annotations", newAnnotation, function (err,doc) {
//     console.log(doc);
//   });

// }


  
  
  // var newAnnotation = {
  //     title: faker.random.arrayElement(["YB380A", "XV23WH", "XV22", "ZP8306B", "ZP8305B", "XV23WH", "ZP8300S", "ZP830", "ZP09560","ZP06180","ZP06175","Z611000", "Y011AXX", "Y011AXL", "Y011ASM", "Y011AMD", "XV22", "XV22WH", "XP82TL", "XP81PL", "XP51FN", "XP14RD", "XP12RD", "XP13RD", "XP11SW"]) + "-" + faker.lorem.sentence(),
  //     message: faker.lorem.sentence() + faker.random.arrayElement(["YB380A", "XV23WH", "XV22", "ZP8306B", "ZP8305B", "XV23WH", "ZP8300S", "ZP830", "ZP09560","ZP06180","ZP06175","Z611000", "Y011AXX", "Y011AXL", "Y011ASM", "Y011AMD", "XV22", "XV22WH", "XP82TL", "XP81PL", "XP51FN", "XP14RD", "XP12RD", "XP13RD", "XP11SW"]) + faker.lorem.sentence() + faker.lorem.sentence() + faker.lorem.sentence() + faker.lorem.sentence() ,
  //     annotater: "demo-bookmark-analytic",
  //     entitytype: faker.random.arrayElement(["analytic"]),
  //     // entitytype: faker.random.arrayElement(["analytic", "price routine", "promotion", "kit"]),
  //     entityid: faker.random.arrayElement([1,2]),
  //     module: faker.random.arrayElement(["planning"]),
  //     // feature: faker.random.arrayElement(["analytics", "pricing-everyday", "pricing-promotions", "pricing-kits"]),
  //     feature: faker.random.arrayElement(["PlanningAnalytics"]),
  //     // step: faker.random.arrayElement(["identity", "filters", "pricelists", "rules", "keydriver", "influencers", "results", "impactanalysis", "approval"]),
  //     step: faker.random.arrayElement(["PlanningAnalyticsIdentity", "PlanningAnalyticsFilters", "PlanningAnalyticsPriceLists", "PlanningAnalyticsValueDrivers", "PlanningAnalyticsResults"]),
  //     control: faker.random.arrayElement(["grid", "panel1", "listbox1"]),
  //     datecreated: faker.date.recent()
  // };

  var newAnnotation = {
      title: faker.random.arrayElement(["YB380A", "XV23WH", "XV22", "ZP8306B", "ZP8305B", "XV23WH", "ZP8300S", "ZP830", "ZP09560","ZP06180","ZP06175","Z611000", "Y011AXX", "Y011AXL", "Y011ASM", "Y011AMD", "XV22", "XV22WH", "XP82TL", "XP81PL", "XP51FN", "XP14RD", "XP12RD", "XP13RD", "XP11SW"]) + "-" + faker.lorem.sentence(),
      message: faker.lorem.sentence() + faker.random.arrayElement(["YB380A", "XV23WH", "XV22", "ZP8306B", "ZP8305B", "XV23WH", "ZP8300S", "ZP830", "ZP09560","ZP06180","ZP06175","Z611000", "Y011AXX", "Y011AXL", "Y011ASM", "Y011AMD", "XV22", "XV22WH", "XP82TL", "XP81PL", "XP51FN", "XP14RD", "XP12RD", "XP13RD", "XP11SW"]) + faker.lorem.sentence() + faker.lorem.sentence() + faker.lorem.sentence() + faker.lorem.sentence() ,
      annotater: "dmac",
      entitytype: faker.random.arrayElement(["pricing"]),
      // entitytype: faker.random.arrayElement(["analytic", "price routine", "promotion", "kit"]),
      entityid: faker.random.arrayElement([1]),
      module: faker.random.arrayElement(["planning"]),
      // feature: faker.random.arrayElement(["analytics", "pricing-everyday", "pricing-promotions", "pricing-kits"]),
      feature: faker.random.arrayElement(["PlanningEverydayPricing"]),
        /*
        None,
        PlanningHome
        PlanningAnalytics
        PlanningEverydayPricing,
        PlanningPromotionPricing,
        PlanningKitPricing,
        PlanningCompetition,
        TrackingHome,
        TrackingPerformance,
        TrackingComparison,
        ReportingHome,
        AdminHome,
        AdminUsers,
        AdminTemplates,
        AdminCompetition
        AdminETLForeignKeyErrors
        */
      // step: faker.random.arrayElement(["identity", "filters", "pricelists", "rules", "keydriver", "influencers", "results", "impactanalysis", "approval"]),
      step: faker.random.arrayElement(["PlanningPricingResults"]),
      
      /*
        PlanningPricingSearch,
        PlanningPricingIdentity,
        PlanningPricingFilters,
        PlanningPricingPriceLists,
        PlanningPricingRules,
        PlanningPricingKeyDriver,
        PlanningPricingInfluencers,
        PlanningPricingResults,
        PlanningPricingImpactAnalysis
        PlanningPricingApproval,
        PlanningKitPricingAdjustments
      */

      //"PlanningAnalyticsIdentity" , "PlanningAnalyticsFilters", "PlanningAnalyticsPriceLists", "PlanningAnalyticsValueDrivers", "PlanningAnalyticsResults"]),
      control: faker.random.arrayElement(["grid", "panel1", "listbox1"]),
      datecreated: faker.date.recent()
  };


  db.saveDoc("annotations", newAnnotation, function (err,doc) {
    console.log(doc);
  });

// db.createSchema('search', function (err, res) {
//   console.log(err);
// });
// db.createDocumentTable('search.notes', function(err, res) {
//   console.log(err);
// });


// db.Search.annotations.save(newAnnotation, function (params) {
  
// });

// db.saveDoc("PX_Main.annotations", {title: "alert - fix this", message: ""}, function (err,doc) {
//    console.log(doc);
// });  



// db.PX_Main.annotations.searchDoc({
//   keys : ["message"],
//   term : "fuga"
// }
// , function(err, docs){
//   console.log(docs);
// });



// db.annotations.searchDoc({
//   keys : ["annotater"],
//   term : "Malvina"
// }
// , function(err, docs){
//   console.log(docs);
// });


// db.createSchema('\"Search\"', function(err, res) {
//   // empty array
// });
