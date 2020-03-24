$(document).ready(function(){
    $('#test').on('click', ()=>{
        var docDefinition = {
            info: {
                title: 'awesome Document',
                author: 'john doe',
                subject: 'subject of document',
                keywords: 'keywords for document',
            },
            content: 'This is an sample PDF printed with pdfMake'
        }
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        var win = window.open('', '_blank');
        pdfDocGenerator.open({}, win);
        //pdfMake.createPdf(docDefinition).open();
    });
});
/*$.ajax({
    url:'/homepage/'+Slanguage+'/'+Scountry+'/'+Sduration+'/'+Saccommodation,
    method: 'GET',
    //data: {Slanguage, Scountry, Sduration, Saccommodation},
    success: (data)=>{
        data.slice(0, 6).forEach(element => {
            var createCourse =
                '<a class="searchCourseListItem btn hotDiscountCard p-2 border d-inline-block mx-2 mb-4" href="/'+element.courseHtml+'?date='+ SstartDate +'"><div class="card border-0" style="width: 18rem;"><div class="position-absolute" style="right:0px;"><div class="position-relative bg-danger rounded-circle text-white text-center" style="border: 1px solid white; width:75px; height:75px; right:-30px; top:-30px;"><span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size:1.4rem;">%'+element.discount+'</span></div></div><img class="card-img-top" src='+element.courseImg+' alt="..." /><div class="card-body pb-0"><h5 class="card-title">'+ element.name +'</h5></div><ul class="list-group list-group-flush"><li class="list-group-item cardDescription" style="height:60px;">Take english courses in the center of the world</li><li class="list-group-item card-link text-right"><span class="font-weight float-left"><i class="far fa-clock"></i> '+element.duration+' Weeks</span><span class="bg-danger text-white rounded p-1 float-right" style="font-size:0.8rem;">Newyork City, USA</span></li></ul></div></a>';
            $("#courselistCards").append(createCourse);
        });
        moreButtonCounter = 6;
        $("#courseSearchSpinner").css("display","none");
    }
}).fail((data)=>{
    console.log('fail: '+data);
});*/