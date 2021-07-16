const express = require('express');
const mongoose = require('mongoose');
const morgan  = require("morgan");
const bodyparser = require("body-parser");
const dotenv = require("dotenv").config({ path: './.env' });
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./NSE_Backend_API_Open_API3.json');
const open = require('open');
// Connect to MongoDB
mongoose.connect(process.env.DATABASE,
  { useNewUrlParser:true, useUnifiedTopology: true,useCreateIndex:true, useFindAndModify: false },
  (err)=>{
      if (err)
      {
        console.log(err);
      }
      else
      {
        console.log('Connected to the  database');
      }
});


//Middlewares

app.use(morgan("dev"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(cors());


// Express body parser
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

const authController = require("./routes/authController");
app.use("/api/v1/",authController);

const masterController = require("./routes/masterController");
app.use("/api/v1/",masterController);

const orderController = require("./routes/orderController");
app.use("/api/v1/",orderController);

const settingController = require("./routes/settingController");
app.use("/api/v1/",settingController);

const symbolController = require("./routes/symbolController");
app.use("/api/v1/",symbolController);

const fundController = require("./routes/fundController");
app.use("/api/v1/",fundController);

const tradeController = require("./routes/tradeController");
app.use("/api/v1/",tradeController);

const livedataController = require("./routes/livedataController");
app.use("/api/v1/",livedataController);

const settingAdminController = require("./routes/settingAdminController");
app.use("/api/v1/",settingAdminController);

const masterAdminController = require("./routes/masterAdminController");
app.use("/api/v1/",masterAdminController);

const liveDataAdminController = require("./routes/liveDataAdminController");
app.use("/api/v1/",liveDataAdminController);

const ohlcSettingController = require("./routes/ohlcSettingController");
app.use("/api/v1/",ohlcSettingController);

const ohlcController = require("./routes/ohlcController");
app.use("/api/v1/",ohlcController);

const cornDaySettingController = require("./routes/cornDaySettingController");
app.use("/api/v1/",cornDaySettingController);

const eventSettingController = require("./routes/eventSettingController");
app.use("/api/v1/",eventSettingController);

const positionController = require("./routes/positionController");
app.use("/api/v1/",positionController);

app.get('*',function(req, res){
  res.redirect("/api-docs");
});

const PORT=process.env.PORT||8000;

app.listen(PORT,err=>{
    if(err){
        console.log(err);
    }else{
        console.log(`App is listening on http://localhost:${PORT} . To see the api documentation go this URL: http://localhost:${PORT}/api-docs .`);
        open(`http://localhost:${PORT}/api-docs`, {app: {name: open.apps.chrome}});
    }
});