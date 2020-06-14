function getImages(school, place, images, k, callback){
  Image.findOne({id:images[k].id}, (err,image)=>{
    images.schoolImage[k]=image.name;
    images.schoolImageId[k]=image.id;
    if(images[k] == images[images.length-1]){
      var obj = {school, place, images}
      callback(obj);
    }
    else{
      getImages(school,place,images,k+1, (obj)=>{});
    }
  })
}



if(i==schools.length-1){
  //console.log('===========>', sendable);
  res.send(sendable);
}
else{
  showSchools(schools, sendable, i+1, res);
}