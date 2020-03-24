$(document).ready(function(){
    /////////////HOMEPAGE KONAKLAMA ŞIKKI HAYIR SEÇİLDİĞİNDE EVETLERİ DE ÇIKART, EVET SEÇİLDİĞİNDE HAYIRLARI ÇIKARTMA....
    console.log()
    var baseQueueURL = $('#queueButton').attr("href");
    //var queueSchoolId='schoolId:';
    //var queueProgramId;
    var queueTime = 'time='+$('#inputSelectCourseTime').val();
    var queueProgram = 'program='+$('#inputSelectCourseProgram').text();
    var queueDate = 'date='+$('#inputSelectCourseDate').val();
    var queueWeek = 'weeks='+$('#inputSelectCourseWeek').val();
    var queueAccommodation = 'accommodation='+$('#inputSelectCourseAccommodation').val();
    var queueAirport = 'airport='+$('#inputSelectCourseAccommodation').val();
    var queueHInsurance = 'hInsurance='+$('#inputSelectCourseAirportPickup').val();
    refreshQueueButtonHref();
    while(true){
        if($('#Program'+programNumber).find('.courseDay-Time').text() == ''){
            break;
        }
        programNumber++;
    }
    //How Many Program This Course Have.
    programNumber--;
    var Pname;
    var PcourseDayTime;
    var PcourseHours;
    var PstartDateDay;
    var PstartDateMonth;
    var PstartDateYear;
    var Pprice;
    var programNumber = 0;
    var tempSelectCourseTime = document.getElementById("inputSelectCourseTime").selectedIndex;
    console.log($('#inputSelectCourseTime option').eq(tempSelectCourseTime).val());
    if($('#inputSelectCourseTime option').eq(tempSelectCourseTime).val() == "empty"){
        disableResSide();
    }
    $(".lowProgramShadow-box").on('click', function(){
        enableResSide();
        $('#reservationSide').addClass('disabled');
        Pname = $(this).find('.courseName').text();
        PcourseDayTime = $(this).find('.courseDay-Time').first().text();
        PcourseHours = $(this).find('.courseHours').first().text();
        PstartDateDay = $(this).find('.courseStartDateDay').first().text();
        PstartDateMonth = $(this).find('.courseStartDateMonth').first().text();
        PstartDateYear = $(this).find('.courseStartDateYear').first().text();
        Pprice = $(this).find('.coursePrice').first().text();


        $.ajax({
            url:'/FilterInCoursePage/'+PcourseDayTime+'/'+Pname+'/'+PcourseHours,
            method: 'GET',
            success: (data)=>{
                $('#inputSelectCourseTime').val(PcourseDayTime);
                $('#inputSelectCourseTime').trigger('change');

                $('#inputSelectCourseDate').prop('value', PstartDateDay+'.'+PstartDateMonth+'.'+PstartDateYear);
                $('#inputSelectCourseWeek').val(PcourseHours);

                var selectedCourseNameOption =
                    '<option value="'+ Pname +'">'+Pname+'</option>';
                $("#inputSelectCourseProgram").append(selectedCourseNameOption);
                $('#inputSelectCourseProgram').val(Pname);
                $('#inputSelectCourseProgram').trigger('change');

                var selectedCourseWeekOption =
                    '<option value="'+ PcourseHours +'">'+PcourseHours+'</option>';
                $("#inputSelectCourseWeek").append(selectedCourseWeekOption);
                $('#inputSelectCourseWeek').val(PcourseHours);
                $('#inputSelectCourseWeek').trigger('change');

                $('#selectedPrice del span').html(data[0].price);
                $('#discountedPrice').html(data[0].discountedPrice);
                $('#reservationSide').removeClass('disabled');
                var queue = document.getElementById('inputSelectCourseProgram'); // Get the list whose id is queue.
                var elements = queue.getElementsByTagName('option'); // Get HTMLCollection of elements with the li tag name.
                $('#inputSelectCourseAirportPickup').trigger('change');
                $('#inputSelectCourseAccommodation').trigger('change');
                $('#inputSelectCourseHInsurance').trigger('change');
                //queue.removeChild(elements[1]);
            }
        }).fail((data)=>{
                console.log('fail: '+data);
            });

        $('#inputSelectCourseDate').removeAttr('disabled');








    });
    $('#inputSelectCourseTime').on('change', ()=>{
        disableResSide();
        $('#reservationSide').addClass('disabled');
        tempSelectCourseTime = document.getElementById("inputSelectCourseTime").selectedIndex;
        var selectedCourseTime = $('#inputSelectCourseTime option').eq(tempSelectCourseTime).val();
        findNextStepCourse(selectedCourseTime);
        $('#inputSelectCourseProgram').removeAttr('disabled');
        $('#reservationSide').removeClass('disabled');
        queueTime ='time='+ selectedCourseTime;
        refreshQueueButtonHref();
    });

    $('#inputSelectCourseProgram').on('change', ()=>{
        $('#reservationSide').addClass('disabled');
        tempSelectCourseTime = document.getElementById("inputSelectCourseTime").selectedIndex;
        var selectedCourseTime = $('#inputSelectCourseTime option').eq(tempSelectCourseTime).val();
        tempSelectCourseProgram = document.getElementById("inputSelectCourseProgram").selectedIndex;
        var selectedCourseProgram = $('#inputSelectCourseProgram option').eq(tempSelectCourseProgram).val();

        findNextStepAfterCourse([selectedCourseTime, selectedCourseProgram]);
        $('#inputSelectCourseDate').removeAttr('disabled');
        $('#inputSelectCourseWeek').removeAttr('disabled');
        $('#inputSelectCourseAccommodation').removeAttr('disabled');
        $('#inputSelectCourseAirportPickup').removeAttr('disabled');
        $('#inputSelectCourseHInsurance').removeAttr('disabled');
        queueProgram ='program='+ selectedCourseProgram;
        refreshQueueButtonHref();
    });
    $('#inputSelectCourseDate').on('change', ()=>{
        var date = new Date($('#inputSelectCourseDate').val());
        day = date.getDate();
        month = date.getMonth() + 1;
        year = date.getFullYear();
        queueDate ='date='+ [day, month, year].join('/');
        console.log(queueDate);
        refreshQueueButtonHref();
    });
    $('#inputSelectCourseWeek').on('change', ()=>{
        $('#reservationSide').addClass('disabled');
        tempSelectCourseTime = document.getElementById("inputSelectCourseTime").selectedIndex;
        var selectedCourseTime = $('#inputSelectCourseTime option').eq(tempSelectCourseTime).val();
        tempSelectCourseProgram = document.getElementById("inputSelectCourseProgram").selectedIndex;
        var selectedCourseProgram = $('#inputSelectCourseProgram option').eq(tempSelectCourseProgram).val();
        tempSelectCourseWeek = document.getElementById("inputSelectCourseWeek").selectedIndex;
        var selectedCourseWeek = $('#inputSelectCourseWeek option').eq(tempSelectCourseWeek).val();
        queueWeek ='week='+ selectedCourseWeek;
        refreshQueueButtonHref();
        $.ajax({
            url:'/FilterInCoursePage/'+selectedCourseTime+'/'+selectedCourseProgram+'/'+selectedCourseWeek,
            method: 'GET',
            success: (data)=>{
                $('#courseExtra').remove();
                var purePrice = data[0].price;
               //$('#selectedPrice del span').html(data[0].price);
                var pureDiscountPrice = data[0].discountedPrice;
                //$('#discountedPrice').html(data[0].discountedPrice);
                var CourseExtraElement =
                        '<div id="courseExtra"><span class="ml-3" style="font-size:0.8rem;">Course Price</span><span id="courseExtraPrice" class="float-right" style="font-size:0.8rem;">'+pureDiscountPrice +'$</span></div>';
                $('#additionalCosts').append(CourseExtraElement);
                //$('#reservationSide').removeClass('disabled');



                tempSelectCourseHInsurance = document.getElementById("inputSelectCourseHInsurance").selectedIndex;
                var selectedCourseHInsurance = $('#inputSelectCourseHInsurance option').eq(tempSelectCourseHInsurance).val();
                if(selectedCourseHInsurance == 'INeed'){
                    purePrice = parseInt(purePrice)+parseInt($('#hInsuranceExtraPrice').text());
                    pureDiscountPrice = parseInt(pureDiscountPrice)+parseInt($('#hInsuranceExtraPrice').text());
                    $('#selectedPrice del span').html(purePrice);
                    $('#discountedPrice').html(pureDiscountPrice);
                }
                else{
                        $('#selectedPrice del span').html(purePrice);
                        $('#discountedPrice').html(pureDiscountPrice);
                }
                tempSelectCourseAccommodation = document.getElementById("inputSelectCourseAccommodation").selectedIndex;
                var selectedCourseAccommodation = $('#inputSelectCourseAccommodation option').eq(tempSelectCourseAccommodation).val();
                if(selectedCourseAccommodation == 'INeed'){
                    purePrice = parseInt(purePrice)+parseInt($('#hInsuranceExtraPrice').text());
                    pureDiscountPrice = parseInt(pureDiscountPrice)+parseInt($('#accommodationExtraPrice').text());
                    $('#selectedPrice del span').html(purePrice);
                    $('#discountedPrice').html(pureDiscountPrice);
                }
                else{
                        $('#selectedPrice del span').html(purePrice);
                        $('#discountedPrice').html(pureDiscountPrice);
                }
                tempSelectCourseAirportPickup = document.getElementById("inputSelectCourseAirportPickup").selectedIndex;
                var selectedCourseAirportPickup = $('#inputSelectCourseAirportPickup option').eq(tempSelectCourseAirportPickup).val();
                if(selectedCourseAirportPickup == 'INeed'){
                    purePrice = parseInt(purePrice)+parseInt($('#hInsuranceExtraPrice').text());
                    pureDiscountPrice = parseInt(pureDiscountPrice)+parseInt($('#airportPickupExtraPrice').text());
                    $('#selectedPrice del span').html(purePrice);
                    $('#discountedPrice').html(pureDiscountPrice);
                }
                else{
                        $('#selectedPrice del span').html(purePrice);
                        $('#discountedPrice').html(pureDiscountPrice);
                }



                $('#reservationSide').removeClass('disabled');
            }
        }).fail((data)=>{
                console.log('fail: '+data);
            });
    });
    $('#inputSelectCourseAccommodation').on('change', ()=>{
        $('#reservationSide').addClass('disabled');
        tempSelectCourseAccommodation = document.getElementById("inputSelectCourseAccommodation").selectedIndex;
        var selectedCourseAccommodation = $('#inputSelectCourseAccommodation option').eq(tempSelectCourseAccommodation).val();

        var oldTotalPrice = parseInt($('#selectedPrice del span').text());
        var oldTotalDiscountedPrice = parseInt($('#discountedPrice').text());
        var schoolName = $('#schoolNameHeader').text();
        queueAccommodation ='accommodation='+ selectedCourseAccommodation;
        refreshQueueButtonHref();
        $.ajax({
            url:'/course/'+schoolName,
            method: 'GET',
            success: (data)=>{
                if(selectedCourseAccommodation == 'INeed'){
                    var accommodationElement =
                        '<div id="accommodationExtra"><span id="accommodationExtraDesc" class="ml-3" style="font-size:0.8rem;">Accommodation</span><span id="accommodationExtraPrice" class="float-right" style="font-size:0.8rem;">'+data.accommodationPrice +'$</span></div>';
                    $('#additionalCosts').append(accommodationElement);
                    $('#selectedPrice del span').html(parseInt(oldTotalPrice) + parseInt(data.accommodationPrice));
                    $('#discountedPrice').html(parseInt(oldTotalDiscountedPrice) + parseInt(data.accommodationPrice));
                }
                else{
                    if($('#accommodationExtra').length){
                        $('#selectedPrice del span').html(parseInt(oldTotalPrice) - parseInt(data.accommodationPrice));
                        $('#discountedPrice').html(parseInt(oldTotalDiscountedPrice) - parseInt(data.accommodationPrice));
                        $('#accommodationExtra').remove();
                    }
                }
                $('#reservationSide').removeClass('disabled');
            }
        });
    });

    $('#inputSelectCourseAirportPickup').on('change', ()=>{
        //$('#airportPickupExtra').remove();
        $('#reservationSide').addClass('disabled');
        tempSelectCourseAirportPickup = document.getElementById("inputSelectCourseAirportPickup").selectedIndex;
        var selectedCourseAirportPickup = $('#inputSelectCourseAirportPickup option').eq(tempSelectCourseAirportPickup).val();

        var oldTotalPrice = parseInt($('#selectedPrice del span').text());
        var oldTotalDiscountedPrice = parseInt($('#discountedPrice').text());
        var schoolName = $('#schoolNameHeader').text();
        queueAirport ='airport='+ selectedCourseAirportPickup;
        refreshQueueButtonHref();
        $.ajax({
            url:'/course/'+schoolName,
            method: 'GET',
            success: (data)=>{
                if(selectedCourseAirportPickup == 'INeed'){
                    var accommodationElement =
                        '<div id="airportPickupExtra"><span id="airportPickupExtraDesc" class="ml-3" style="font-size:0.8rem;">Airport Pickup</span><span id="airportPickupExtraPrice" class="float-right" style="font-size:0.8rem;">'+data.airportPrice +'$</span></div>';
                    $('#additionalCosts').append(accommodationElement);
                    $('#selectedPrice del span').html(parseInt(oldTotalPrice) + parseInt(data.airportPrice));
                    $('#discountedPrice').html(parseInt(oldTotalDiscountedPrice) + parseInt(data.airportPrice));
                }
                else{
                    console.log($('#airportPickupExtra').length);
                    if($('#airportPickupExtraDesc').text().length > 0){
                        $('#selectedPrice del span').html(parseInt(oldTotalPrice) - parseInt(data.airportPrice));
                        $('#discountedPrice').html(parseInt(oldTotalDiscountedPrice) - parseInt(data.airportPrice));
                        $('#airportPickupExtra').remove();
                    }
                }
                $('#reservationSide').removeClass('disabled');
            }
        })
    });

    $('#inputSelectCourseHInsurance').on('change', ()=>{
        $('#reservationSide').addClass('disabled');
        tempSelectCourseHInsurance = document.getElementById("inputSelectCourseHInsurance").selectedIndex;
        var selectedCourseHInsurance = $('#inputSelectCourseHInsurance option').eq(tempSelectCourseHInsurance).val();

        var oldTotalPrice = parseInt($('#selectedPrice del span').text());
        var oldTotalDiscountedPrice = parseInt($('#discountedPrice').text());
        var schoolName = $('#schoolNameHeader').text();
        queueHInsurance ='hInsurance='+ selectedCourseHInsurance;
        refreshQueueButtonHref();
            $.ajax({
                url:'/course/'+schoolName,
                method: 'GET',
                success: (data)=>{
                    if(selectedCourseHInsurance == 'INeed'){
                        var accommodationElement =
                            '<div id="hInsuranceExtra"><span id="hInsuranceExtraDesc" class="ml-3" style="font-size:0.8rem;">Health Insurance</span><span id="hInsuranceExtraPrice" class="float-right" style="font-size:0.8rem;">'+data.hInsurancePrice +'$</span></div>';
                        $('#additionalCosts').append(accommodationElement);
                        $('#selectedPrice del span').html(parseInt(oldTotalPrice) + parseInt(data.hInsurancePrice));
                        $('#discountedPrice').html(parseInt(oldTotalDiscountedPrice) + parseInt(data.hInsurancePrice));
                    }
                    else{
                        if($('#hInsuranceExtra').length){
                            $('#selectedPrice del span').html(parseInt(oldTotalPrice) - parseInt(data.hInsurancePrice));
                            $('#discountedPrice').html(parseInt(oldTotalDiscountedPrice) - parseInt(data.hInsurancePrice));
                            $('#hInsuranceExtra').remove();
                        }
                    }
                    $('#reservationSide').removeClass('disabled');
                }
            })
    });




    function refreshQueueButtonHref(){
        var newLink = baseQueueURL+'?'+queueTime+'&'+queueProgram+'&'+queueDate+'&'+queueWeek+'&'+queueAccommodation+'&'+queueAirport+'&'+queueHInsurance;
        $('#queueButton').attr("href", newLink);
    }
});
function enableResSide(){
    $('#inputSelectCourseProgram').removeAttr('disabled');
    $('#inputSelectCourseDate').removeAttr('disabled');
    $('#inputSelectCourseWeek').removeAttr('disabled');
    //$('#inputSelectCourseAccommodation').removeAttr('disabled');
    //$('#inputSelectCourseAirportPickup').removeAttr('disabled');
    //$('#inputSelectCourseHInsurance').removeAttr('disabled');
}

function disableResSide(){
    $('#inputSelectCourseProgram').attr('disabled', 'disabled');
    $('#inputSelectCourseDate').attr('disabled', 'disabled');
    $('#inputSelectCourseWeek').attr('disabled', 'disabled');
    //$('#inputSelectCourseAccommodation').attr('disabled', 'disabled');
    //$('#inputSelectCourseAirportPickup').attr('disabled', 'disabled');
    //$('#inputSelectCourseHInsurance').attr('disabled', 'disabled');
}

function findNextStepCourse(selected){
    $('#inputSelectCourseProgram').empty();
    //$('#inputSelectCourseDate').empty();
    $('#inputSelectCourseWeek').empty();


    $('#inputSelectCourseProgram').append('<option value="empty" hidden>Select.</option>');
    //$('#inputSelectCourseDate').append('<option value="empty" hidden>Select.</option>');
    $('#inputSelectCourseWeek').append('<option value="empty" hidden>Select.</option>');




    $('#inputSelectCourseProgram').val('empty');
    //$('#inputSelectCourseDate').val('empty');
    $('#inputSelectCourseWeek').val('empty');
    console.log('Enter To Function');
    var allNewOptions = [];
    var filteredNewOptions = [];
    var i = 0;
    $.ajax({
            url:'/FilterInCoursePage/'+selected,
            method: 'GET',
            data: {selected},
            success: (data)=>{
                console.log('Enter To Ajax');
                console.log(data);
                var tempProgramNameForEach = 0;
                data.forEach((element) => {
                    console.log('Enter To forEach Loop');
                    allNewOptions.push(data[tempProgramNameForEach].name);
                    console.log(allNewOptions);
                    tempProgramNameForEach++;
                });
                var check = 0;
                var i=0;
                var x=0;
                for(i = 0;i<allNewOptions.length;i++){
                    console.log('Enter To First For Loop');
                    for(x =0;x<filteredNewOptions.length;x++){
                        console.log('Enter To Second For Loop');
                        if(allNewOptions[i] == filteredNewOptions[x]){
                            check=1;
                        }
                    }
                    if(check ==0){
                        console.log('Enter To Push If--> Index Of ==' + i);
                        console.log('Selected Element::::::::::'+allNewOptions[i]);
                        filteredNewOptions.push(allNewOptions[i]);
                        console.log('pushed::::'+allNewOptions[i]);
                    }
                    check =0;
                }
                console.log('End Of AllNewOptions:' + allNewOptions);
                for(var i=0; i<filteredNewOptions.length;i++){
                    var newCourseNameOption =
                        '<option value="'+ filteredNewOptions[i] +'">'+filteredNewOptions[i]+'</option>';
                    $("#inputSelectCourseProgram").append(newCourseNameOption);
                }
                var queue = document.getElementById('inputSelectCourseProgram'); // Get the list whose id is queue.
                var elements = queue.getElementsByTagName('option'); // Get HTMLCollection of elements with the li tag name.
                for(var i=0;i<$('#inputSelectCourseProgram option').length-1;i++){
                    for(var x = i+1; x<$('#inputSelectCourseProgram option').length;x++){
                        console.log('Element--->'+i+':::'+elements[i].text);
                        console.log('Element--->'+x+':::'+elements[x].text);
                        if(elements[i].text==elements[x].text){
                            queue.removeChild(elements[x]);
                            break;
                        }
                        console.log('next');
                    }
                }
            }
        }).fail((data)=>{
            console.log('fail: '+data);
        });
}


function findNextStepAfterCourse(selected){
    $('#inputSelectCourseWeek').empty();


    $('#inputSelectCourseWeek').append('<option value="empty" hidden>Select.</option>');


    $('#inputSelectCourseWeek').val('empty');
    console.log('Enter To Function');
    var allNewOptions = [];
    var filteredNewOptions = [];
    var i = 0;
    $.ajax({
            url:'/FilterInCoursePage/'+selected[0]+'/'+selected[1],
            method: 'GET',
            success: (data)=>{
                console.log('Enter To Ajax');
                console.log(data);
                var tempProgramNameForEach = 0;
                data.forEach((element) => {
                    console.log('Enter To forEach Loop');
                    allNewOptions.push(data[tempProgramNameForEach]);
                    console.log(allNewOptions);
                    tempProgramNameForEach++;
                });
                var check = 0;
                var i=0;
                var x=0;
                //HOURS-----------
                for(i = 0;i<allNewOptions.length;i++){
                    console.log('Enter To First For Loop');
                    for(x =0;x<filteredNewOptions.length;x++){
                        console.log('Enter To Second For Loop');
                        if(allNewOptions[i].hours == filteredNewOptions[x].hours){
                            check=1;
                        }
                    }
                    if(check ==0){
                        console.log('Enter To Push If--> Index Of ==' + i);
                        console.log('Selected Element::::::::::'+allNewOptions[i].hours);
                        filteredNewOptions.push(allNewOptions[i].hours);
                        console.log('pushed::::'+allNewOptions[i].hours);
                    }
                    check =0;
                }
                console.log('End Of filteredNewOptions:' + filteredNewOptions);
                for(var i=0; i<filteredNewOptions.length;i++){
                    var newCourseNameOption =
                        '<option value="'+ filteredNewOptions[i] +'">'+filteredNewOptions[i]+'</option>';
                    $("#inputSelectCourseWeek").append(newCourseNameOption);
                }
                //$('#selectedPrice del span').html(data[0].price);
                //$('#discountedPrice').html(data[0].discountedPrice);
                var queue = document.getElementById('inputSelectCourseWeek'); // Get the list whose id is queue.
                var elements = queue.getElementsByTagName('option'); // Get HTMLCollection of elements with the li tag name.
                for(var i=0;i<$('#inputSelectCourseWeek option').length-1;i++){
                    for(var x = i+1; x<$('#inputSelectCourseWeek option').length;x++){
                        console.log('Element--->'+i+':::'+elements[i].text);
                        console.log('Element--->'+x+':::'+elements[x].text);
                        if(elements[i].text==elements[x].text){
                            queue.removeChild(elements[x]);
                            break;
                        }
                        console.log('next');
                    }
                }
                $('#reservationSide').removeClass('disabled');
            }
        }).fail((data)=>{
            console.log('fail: '+data);
        });
}



