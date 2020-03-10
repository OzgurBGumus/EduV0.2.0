$(document).ready(function(){
    var programNumber=1;
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

        Pname = $(this).find('.courseName').text();
        PcourseDayTime = $(this).find('.courseDay-Time').first().text();
        PcourseHours = $(this).find('.courseHours').first().text();
        PstartDateDay = $(this).find('.courseStartDateDay').first().text();
        PstartDateMonth = $(this).find('.courseStartDateMonth').first().text();
        PstartDateYear = $(this).find('.courseStartDateYear').first().text();
        Pprice = $(this).find('.coursePrice').first().text();
        $('#inputSelectCourseTime').val(PcourseDayTime);
        $('#inputSelectCourseProgram').val(Pname);
        $('#inputSelectCourseDate').prop('value', PstartDateDay+'.'+PstartDateMonth+'.'+PstartDateYear);
        $('#inputSelectCourseWeek').val(PcourseHours);
        disableResSide();

        var selectedCourseWeekOption =
            '<option value="'+ PcourseHours +'">'+PcourseHours+'</option>';
        $("#inputSelectCourseWeek").append(selectedCourseWeekOption);
        $('#inputSelectCourseWeek').val(PcourseHours);

        var selectedCourseNameOption =
            '<option value="'+ Pname +'">'+Pname+'</option>';
        $("#inputSelectCourseProgram").append(selectedCourseNameOption);
        $('#inputSelectCourseProgram').val(Pname);

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
    });
    $('#inputSelectCourseAccommodation').on('change', ()=>{
        $('#reservationSide').addClass('disabled');
        tempSelectCourseAccommodation = document.getElementById("inputSelectCourseAccommodation").selectedIndex;
        var selectedCourseAccommodation = $('#inputSelectCourseAccommodation option').eq(tempSelectCourseAccommodation).val();
        if(selectedCourseAccommodation == 'INeed'){
            var schoolName = $('#schoolNameHeader').text();
            $.ajax({
                url:'/course/'+schoolName,
                method: 'GET',
                success: (data)=>{
                    var accommodationElement =
                        '<div id="accommodationExtra"><span class="ml-3" style="font-size:0.8rem;">Accommodation</span><span class="float-right" style="font-size:0.8rem;">'+data.accommodationPrice +'$</span></div>';
                    $('#additionalCosts').append(accommodationElement);
                    $('#reservationSide').removeClass('disabled');
                }
            })
        }
        else{
            $('#accommodationExtra').remove();
            $('#reservationSide').removeClass('disabled');
        }
    });

    $('#inputSelectCourseAirportPickup').on('change', ()=>{
        $('#reservationSide').addClass('disabled');
        tempSelectCourseAirportPickup = document.getElementById("inputSelectCourseAirportPickup").selectedIndex;
        var selectedCourseAirportPickup = $('#inputSelectCourseAirportPickup option').eq(tempSelectCourseAirportPickup).val();
        if(selectedCourseAirportPickup == 'INeed'){
            var schoolName = $('#schoolNameHeader').text();
            $.ajax({
                url:'/course/'+schoolName,
                method: 'GET',
                success: (data)=>{
                    var accommodationElement =
                        '<div id="airportPickupExtra"><span class="ml-3" style="font-size:0.8rem;">Airport Pickup</span><span class="float-right" style="font-size:0.8rem;">'+data.airportPrice +'$</span></div>';
                    $('#additionalCosts').append(accommodationElement);
                    $('#reservationSide').removeClass('disabled');
                }
            })
        }
        else{
            $('#airportPickupExtra').remove();
            $('#reservationSide').removeClass('disabled');
        }
    });

    $('#inputSelectCourseHInsurance').on('change', ()=>{
        $('#reservationSide').addClass('disabled');
        tempSelectCourseHInsurance = document.getElementById("inputSelectCourseHInsurance").selectedIndex;
        var selectedCourseHInsurance = $('#inputSelectCourseHInsurance option').eq(tempSelectCourseHInsurance).val();
        if(selectedCourseHInsurance == 'INeed'){
            var schoolName = $('#schoolNameHeader').text();
            $.ajax({
                url:'/course/'+schoolName,
                method: 'GET',
                success: (data)=>{
                    var accommodationElement =
                        '<div id="hInsuranceExtra"><span class="ml-3" style="font-size:0.8rem;">Health Insurance</span><span class="float-right" style="font-size:0.8rem;">'+data.hInsurancePrice +'$</span></div>';
                    $('#additionalCosts').append(accommodationElement);
                    $('#reservationSide').removeClass('disabled');
                }
            })
        }
        else{
            $('#hInsuranceExtra').remove();
            $('#reservationSide').removeClass('disabled');
        }
    });





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
            }
        }).fail((data)=>{
            console.log('fail: '+data);
        });
}

function findNextStepAfterCourse(selected){
    $('#inputSelectCourseDate').empty();
    $('#inputSelectCourseWeek').empty();


    $('#inputSelectCourseDate').append('<option value="empty" hidden>Select.</option>');
    $('#inputSelectCourseWeek').append('<option value="empty" hidden>Select.</option>');




    $('#inputSelectCourseDate').val('empty');
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
                $('#reservationSide').removeClass('disabled');
            }
        }).fail((data)=>{
            console.log('fail: '+data);
        });
}

