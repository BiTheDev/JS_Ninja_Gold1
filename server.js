var express = require("express");
var session = require('express-session');
console.log("Let's find out what express is", express);
// invoke express and store the result in the variable app
var app = express();
console.log("Let's find out what app is", app);
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "./static")));
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.get('/', function(request, response) {
    if(!request.session.gold){
        request.session.gold = 0;
        request.session.activity = [];
    }
    console.log(request.session.activity+ "index");
    response.render('index', {gold : request.session.gold, activity : request.session.activity.reverse()});
})
app.post('/process_money', function(request, response) {
    console.log(request.body);
    var get_gold;
    if(request.body.building == "Farm"){
        get_gold = Math.floor(Math.random() * 20 + 10);
        response.send(request.session.gold += get_gold);
    }else if(request.body.building == "Cave"){
        get_gold = Math.floor(Math.random() * 10 + 5);
        response.send(request.session.gold += get_gold);
    }else if(request.body.building == "House"){
        get_gold = Math.floor(Math.random() * 5 + 2);
        response.send(request.session.gold += get_gold);
    }else if(request.body.building == "Casino"){
        get_gold = Math.floor((Math.random() * 100) - 50);
        response.send(request.session.gold += get_gold);
    }
    if(get_gold < 0 ){
    var activity = "lose "+ get_gold+ " gold from " + request.body.building;
    }else{
        var activity = "Get "+ get_gold+ " gold from " + request.body.building;
    }
    response.send(request.session.activity.push(activity));
    console.log(request.session.activity);
    request.session.save();
    response.redirect('/');
})
app.get('/reset', function(request, response){
    request.session.destroy();
    response.redirect('/');
})

app.listen(8000, function() {
    console.log("listening on port 8000");
  })