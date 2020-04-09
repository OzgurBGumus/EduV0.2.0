$(document).ready(function(){
    var Schools = [];
    var Programs = [];
    $.ajax({
        url:'/course/all',
        method: 'GET',
        success: (school)=>{
            Schools = school;
            $.ajax({
                url:'/programCourseId/all',
                method: 'GET',
                success: (program)=>{
                    Programs = program;
        
                    var i = 0;
                    var hotDiscountItem;
                    var discountCardDiscounts=[0,0,0];
                    var temp;
                    for(temp = 0; temp<Programs.length;temp++){
                        if(Programs[temp].discount > discountCardDiscounts[0]){
                            discountCardDiscounts[2] = discountCardDiscounts[1];
                            discountCardDiscounts[1] = discountCardDiscounts[0];
                            discountCardDiscounts[0] = Programs[temp].discount;
                        }
                        else if(Programs[temp].discount > discountCardDiscounts[1]){
                            discountCardDiscounts[2] = discountCardDiscounts[1];
                            discountCardDiscounts[1] = Programs[temp].discount;
                        }
                        else if(Programs[temp].discount > discountCardDiscounts[2]){
                            discountCardDiscounts[2] = Programs[temp].discount;
                        }
                    }
        
        
        
                    var discountCardPrograms = [];
                    for(temp=0;temp<3;temp++){
                        var found = Programs.find(function(element){
                            if(element.discount == discountCardDiscounts[temp])
                                return element;
                        });
                        discountCardPrograms.push(found);
                        console.log(discountCardPrograms);
                    }
        
        
        
        
        
                    var discountCardSchools = [];
                    for(temp=0;temp<3;temp++){
                        console.log('here?');
                        var found = Schools.find(function(element){
                            console.log(element)
                            if(element.courseId == discountCardPrograms[temp].courseId)
                                return element;
                        });
                        discountCardSchools.push(found);
                        console.log(discountCardSchools);
                    }
        
                    var coursePlace="";
                    console.log(discountCardSchools[0].country);
                    for(i=0;i<3;i++){
                        if(discountCardSchools[i].country != ''){
                            coursePlace = discountCardSchools[i].country;
                            console.log(coursePlace);
                        }
                        if(discountCardSchools[i].state != ''){
                            coursePlace = coursePlace +", "+ discountCardSchools[i].state;
                        }
                        if(discountCardSchools[i].city != ''){
                            coursePlace = coursePlace +", "+ discountCardSchools[i].city;
                        }
                        hotDiscountItem =
                                '<a class="btn hotDiscountCard p-2 border d-inline-block mx-2" href="/'+Schools[i].courseHtml+'"> <div class="card border-0" style="width: 18rem;"> <div class="position-absolute" style="right:0px;"> <div class="position-relative bg-danger rounded-circle text-white text-center" style="border: 1px solid white; width:75px; height:75px; right:-30px; top:-30px;"><span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size:1.4rem;">%'+discountCardPrograms[i].discount+'</span></div> </div><img class="card-img-top" src="'+Schools[i].courseImg+'" alt="..." /> <div class="card-body pb-0"> <h5 class="card-title">'+Schools[i].name+'</h5> </div> <ul class="list-group list-group-flush"> <li class="list-group-item cardDescription" style="height:60px;">Take english courses in the center of the world</li> <li class="list-group-item card-link text-right"><span class="font-weight float-left"><i class="far fa-clock"></i> '+discountCardPrograms[i].hours+' Weeks</span><span class="bg-danger text-white rounded p-1 float-right" style="font-size:0.8rem;">'+coursePlace+'</span></li> </ul> </div> </a>';
                        $('#hotdiscountsListBox').append(hotDiscountItem);
                        coursePlace = "";
                    }
        
        
        
        
                }
            });
        }
    });
});