const util = require("util");
const path = require("path");
const multer = require("multer");
const Image = require('../models/Image');
const School = require('../models/School');

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../public/images/upload`));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
      return callback(message, null);
    }
    var filename = req.query.http+` Date.${Date.now()}-bezkoder-${file.originalname}`;
    var i = 0;
    School.find({}, (err, schools)=>{
      for(i=0;i<schools.length;i++){
        if(schools[i].schoolId != i){
          break;
        }
      }
    });
    School.findOne({'schoolHttp':req.query.http}, (err, school)=>{
      const image = new Image({
        Id: i,
        schoolId: school.schoolId,
        name: `Date.${Date.now()}-schoolImage-${file.originalname}`,
        main: true
        });
  
      image.save((err, data)=>{
         if (err)
              console.log(err);
      });
    })
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("multi-files", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;