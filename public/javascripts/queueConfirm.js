var schoolId;
var programId;
$(document).ready(function(){
    var pricesLoading = 
        '<div id="pricesLoading"><img src="../images/Rolling.gif" alt="" /></div>';
    $("#prices").append(pricesLoading);
    var cName = $('#confirmProgramName').text();
    var cTime = $('#confirmTime').text();
    var cWeek = $('#confirmWeek').text();
    var cAccommodation = $('#confirmAccommodation').text();
    var cAirport = $('#confirmAirport').text();
    var cHInsurance = $('#confirmHInsurance').text();
    var cDate = $('#confirmDate').text();
    console.log(cName, cTime, cWeek);
    $.ajax({
        url:'/confirm/'+cName+'/'+cTime+'/'+cWeek,
        method: 'GET',
        //data: {Slanguage, Scountry, Sduration, Saccommodation},
        success: (data)=>{
            //[0] --> School
            //[1] --> Program
            schoolId = data[0].schoolId;
            programId = data[1].programId;
            $('#confirmSchoolName').text(data[0].name);
            $('#confirmLocation').text(data[0].country+' '+data[0].state+' '+data[0].city);
            $('#confirmProgramName').text(data[1].name);

            $('#confirmSchoolName').text(data[0].name);
            var coursePrice = 
                '<div id="coursePriceTab"><span style="width:10rem; display:inline-block">Course:</span><span style="" id="coursePrice">'+data[1].discountedPrice+'</span></div>';
            $("#prices").append(coursePrice);
            if($('#confirmAccommodation').text() == '  Yes'){
                var createPriceListItem =
                        '<div id="accommodationPriceTab"><span style="width:10rem; display:inline-block">Accommodation:</span><span style="" id="accommodationPrice">'+data[0].accommodationPrice+'</span></div>';
                    $("#prices").append(createPriceListItem);
            }
            if($('#confirmAirport').text() == '  Yes'){
                var createPriceListItem =
                        '<div id="airportPriceTab"><span style="width:10rem; display:inline-block">Airport Pickup:</span><span style="" id="airportPrice">'+data[0].airportPrice+'</span></div>';
                    $("#prices").append(createPriceListItem);
            }
            if($('#confirmHInsurance').text() == '  Yes'){
                var createPriceListItem =
                        '<div id="hInsurancePriceTab"><span style="width:10rem; display:inline-block">Health Insurance:</span><span style="" id="hInsurancePrice">'+data[0].hInsurancePrice+'</span></div>';
                    $("#prices").append(createPriceListItem);
            }
            $('#pricesLoading').remove()
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
    $('#createNewReservation').on('click', ()=>{
        var userName = $('#name').val();
        var userSurname = $('#surname').val();
        var userEmail = $('#email').val();
        var userNationality = $('#nationality').val();
        var userResidence = $('#residence').val();
        var userCity = $('#city').val();
        var userMobileNo = $('#mobileNo').val();
        var userCommunication = $('#communication').val();
        var userNotes = $('#notes').val();

        $.ajax({
            url:'/reservation/getPdf?'+'schoolId='+schoolId+'&programId='+programId+'&name='+userName+'&surname='+userSurname+'&email='+userEmail+'&nationality='+userNationality+'&residence='+userResidence+'&city='+userCity+'&mobileNo='+userMobileNo+'&communication='+userCommunication+'&notes='+userNotes+'&accommodation='+cAccommodation+'&airport='+cAirport+'&hInsurance='+cHInsurance+'&startDate='+cDate,
            method: 'GET',
            success: (data)=>{
                window.location.href="/reservation/completed/"+data.reservationId;
            }
        }).fail((data)=>{
            console.log('fail: '+data);
        });
        var docDefinition = {
            info: {
                title: 'awesome Document',
                author: 'john doe',
                subject: 'subject of document',
                keywords: 'keywords for document',
            },
            content: 'This is an sample PDF printed with pdfMake'
        }
        /////const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        /////var win = window.open('', '_blank');
        /////pdfDocGenerator.open({}, win);
        
        
        
        //pdfMake.createPdf(docDefinition).open();
    });
});