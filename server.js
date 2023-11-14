const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const dbConfig = require('./dbconfig/index')
const router = require('./routes/routes')
const cookieParser = require("cookie-parser");
const controlpanel_api = require('./routes/controlpanel');
// const android_api = require('./routes/android');
const projects_api = require('./routes/projects');


// try{
//     dbConfig.authenticate();
//     console.log(`Database Connected...`);
//     dbConfig.sync();
// }catch(err){
//     console.log(err)
// }

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('assets'));

const port = process.env.PORT || 2345
app.use('/',router);
app.use('/control', controlpanel_api)
app.use('/projects', projects_api)

app.listen(port,()=>{
    console.log('server is running on port:' + port)
})

