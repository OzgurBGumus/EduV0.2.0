$(document).ready(function(){
    var programNumber=1;
    $('#Program11').find('.courseDay-Time').text();
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
    $('#schoolPlace').on("click", (event)=>{
        alert(this.text());
    });
    $(".lowProgramShadow-box").on('click', function(){
        Pname = $(this).find('.courseName').text();
        PcourseDayTime = $(this).find('.courseDay-Time').first().text();
        PcourseHours = $(this).find('.courseHours').first().text();
        PstartDateDay = $(this).find('.courseStartDateDay').first().text();
        PstartDateMonth = $(this).find('.courseStartDateMonth').first().text();
        PstartDateYear = $(this).find('.courseStartDateYear').first().text();
        Pprice = $(this).find('.coursePrice').first().text();
        console.log(PcourseDayTime, PcourseHours);
        $('#inputSelectCourseTime').val(PcourseDayTime);
        $('#inputSelectCourseProgram').val(Pname);
        $('#inputSelectCourseDate').prop('value', PstartDateDay+'.'+PstartDateMonth+'.'+PstartDateYear);
        $('#inputSelectCourseWeek').val(PcourseHours);
        enableResSide();

    });
    var tempSelectCourseTime = document.getElementById("inputSelectCourseTime").selectedIndex;
    var oldSelectedProgramTime;
    $('#inputSelectCourseTime').on('change', ()=>{
        tempSelectCourseTime = document.getElementById("inputSelectCourseTime").selectedIndex;
        var selectedCourseTime = $('#inputSelectCourseTime option').eq(tempSelectCourseTime).val();
        findNextStepCourse(selectedCourseTime);
        $('#inputSelectCourseProgram').removeAttr('disabled');
    });
    if($('#inputSelectCourseTime option').eq(tempSelectCourseTime).val() == "empty"){
        disableResSide();
    }

    $('#inputSelectCourseProgram').on('change', ()=>{
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
});
function enableResSide(){
    $('#inputSelectCourseProgram').removeAttr('disabled');
    $('#inputSelectCourseDate').removeAttr('disabled');
    $('#inputSelectCourseWeek').removeAttr('disabled');
    $('#inputSelectCourseAccommodation').removeAttr('disabled');
    $('#inputSelectCourseAirportPickup').removeAttr('disabled');
    $('#inputSelectCourseHInsurance').removeAttr('disabled');
}

function disableResSide(){
    $('#inputSelectCourseProgram').attr('disabled', 'disabled');
    $('#inputSelectCourseDate').attr('disabled', 'disabled');
    $('#inputSelectCourseWeek').attr('disabled', 'disabled');
    $('#inputSelectCourseAccommodation').attr('disabled', 'disabled');
    $('#inputSelectCourseAirportPickup').attr('disabled', 'disabled');
    $('#inputSelectCourseHInsurance').attr('disabled', 'disabled');
}

function findNextStepCourse(selected){
    $('#inputSelectCourseProgram').empty();
    $('#inputSelectCourseDate').empty();
    $('#inputSelectCourseWeek').empty();
    $('#inputSelectCourseAccommodation').empty();
    $('#inputSelectCourseAirportPickup').empty();
    $('#inputSelectCourseHInsurance').empty();


    $('#inputSelectCourseProgram').append('<option value="empty" hidden>Select.</option>');
    $('#inputSelectCourseDate').append('<option value="empty" hidden>Select.</option>');
    $('#inputSelectCourseWeek').append('<option value="empty" hidden>Select.</option>');
    $('#inputSelectCourseAccommodation').append('<option value="empty" hidden>Select.</option>');
    $('#inputSelectCourseAirportPickup').append('<option value="empty" hidden>Select.</option>');
    $('#inputSelectCourseHInsurance').append('<option value="empty" hidden>Select.</option>');




    $('#inputSelectCourseProgram').val('empty');
    $('#inputSelectCourseDate').val('empty');
    $('#inputSelectCourseWeek').val('empty');
    $('#inputSelectCourseAccommodation').val('empty');
    $('#inputSelectCourseAirportPickup').val('empty');
    $('#inputSelectCourseHInsurance').val('empty');
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
    $('#inputSelectCourseAccommodation').empty();
    $('#inputSelectCourseAirportPickup').empty();
    $('#inputSelectCourseHInsurance').empty();


    $('#inputSelectCourseDate').append('<option value="empty" hidden>Select.</option>');
    $('#inputSelectCourseWeek').append('<option value="empty" hidden>Select.</option>');
    $('#inputSelectCourseAccommodation').append('<option value="empty" hidden>Select.</option>');
    $('#inputSelectCourseAirportPickup').append('<option value="empty" hidden>Select.</option>');
    $('#inputSelectCourseHInsurance').append('<option value="empty" hidden>Select.</option>');




    $('#inputSelectCourseDate').val('empty');
    $('#inputSelectCourseWeek').val('empty');
    $('#inputSelectCourseAccommodation').val('empty');
    $('#inputSelectCourseAirportPickup').val('empty');
    $('#inputSelectCourseHInsurance').val('empty');
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
            }
        }).fail((data)=>{
            console.log('fail: '+data);
        });
}
