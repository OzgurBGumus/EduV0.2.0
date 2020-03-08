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
        $('#inputSelectCourseTime').val(PcourseDayTime);
        $('#inputSelectCourseProgram').prop('value', PcourseDayTime);
        $('#inputSelectCourseDate').prop('value', PstartDateDay+'.'+PstartDateMonth+'.'+PstartDateYear);
        $('#inputSelectCourseWeek').prop('value', PcourseHours);
        enableResSide();

    });
    var tempSelectCourseTime = document.getElementById("inputSelectCourseTime").selectedIndex;
    $('#inputSelectCourseTime').on('change', ()=>{
        tempSelectCourseTime = document.getElementById("inputSelectCourseTime").selectedIndex;
        const selectedCourseTime = $('#inputSelectCourseTime option').eq(tempSelectCourseTime).val();
        findNextStepCourse('Morning');
        $('#inputSelectCourseProgram').removeAttr('disabled');
    });
    if($('#inputSelectCourseTime option').eq(tempSelectCourseTime).val() == "empty"){
        disableResSide();
    }
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
    const allNewOptions = [];
    const filteredNewOptions = [];
    const i = 0;
    /*const sendable = ""
    for(i=0;i<selected.length;i++){
        sendable=sendable + '/:'+selected[0];
    }*/
    $.ajax({
            url:'/FilterInCoursePage/:'+selected,
            method: 'GET',
            success: (data)=>{
                data.forEach(element => {
                    allNewOptions.push(data.name)
                });
                var check = 0;
                var i=0;
                var x=0;
                for(i = 0;i<allNewOptions.length;i++){
                    for(x =0;x<filteredNewOptions.length;x++){
                        if(allNewOptions[i] == filteredNewOptions[x]){
                            check=1;
                        }
                    }
                    if(check ==0){
                        filteredNewOptions.push(allNewOptions[i]);
                    }
                    check =0;
                }
                for(const i=0; i<filteredNewOptions.length;i++){
                    var newCourseNameOption =
                        '<option value="'+ filteredNewOptions[i] +'"></option>';
                    $("#inputSelectCourseProgram").append(newCourseNameOption);
                }
            }
        }).fail((data)=>{
            console.log('fail: '+data);
        });
}

function findNextStepCourse(selected){
    const allNewOptions = [];
    const filteredNewOptions = [];
    const i = 0;
    /*const sendable = ""
    for(i=0;i<selected.length;i++){
        sendable=sendable + '/:'+selected[0];
    }*/
    $.ajax({
            url:'/FilterInCoursePage/:'+selected,
            method: 'GET',
            success: (data)=>{
                data.forEach(element => {
                    allNewOptions.push(data.name)
                });
                var check = 0;
                var i=0;
                var x=0;
                for(i = 0;i<allNewOptions.length;i++){
                    for(x =0;x<filteredNewOptions.length;x++){
                        if(allNewOptions[i] == filteredNewOptions[x]){
                            check=1;
                        }
                    }
                    if(check ==0){
                        filteredNewOptions.push(allNewOptions[i]);
                    }
                    check =0;
                }
                for(const i=0; i<filteredNewOptions.length;i++){
                    var newCourseNameOption =
                        '<option value="'+ filteredNewOptions[i] +'"></option>';
                    $("#inputSelectCourseProgram").append(newCourseNameOption);
                }
            }
        }).fail((data)=>{
            console.log('fail: '+data);
        });
}
