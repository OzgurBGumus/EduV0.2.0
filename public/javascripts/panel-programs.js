$(document).ready(function(){
    $('#refreshListsButton').on('click', function(){
        $('#addNew').hide();
        var l = Ladda.create(this);
        l.start();
        refreshNewOptions(refreshProgramList(()=>{
            $('#addNew').show();
            $('#addNew').removeAttr('disabled');
            l.stop();
        }));
    });
    $('#refreshListsButton').trigger('click');
    $('#createNewProgramButton').on('click', function(){
        var l = Ladda.create(this);
        l.start();
        var checks = [];
        checks[0] = 0;
        if($('.bootstrap-switch-id-discountCheck').hasClass('bootstrap-switch-on')){
            checks[0]=1;
        }
        checkNewProgramBoxes(checks, l, (status, extras)=>{
            if(status ==true){
                console.log('/find/program?name='+$('#addName').val()+'&schoolId='+$('#addSchool').children("option:selected").val()+'&weeks='+$('#addWeeks').val()+'&hours='+$('#addHours').val()+'&languageId='+$('#addLanguage').children("option:selected").val()+'&price='+$('#addPrice').val()+'&timeId='+$('#addTime').children("option:selected").val()+'&start='+$('#addStartDate').val()+'&end='+$('#addEndDate').val()+'&description='+$('#addDescription').val()+extras);
                $.ajax({
                    url:'/find/program?name='+$('#addName').val()+'&schoolId='+$('#addSchool').children("option:selected").val()+'&weeks='+$('#addWeeks').val()+'&hours='+$('#addHours').val()+'&languageId='+$('#addLanguage').children("option:selected").val()+'&price='+$('#addPrice').val()+'&timeId='+$('#addTime').children("option:selected").val()+'&start='+$('#addStartDate').val()+'&end='+$('#addEndDate').val()+'&description='+$('#addDescription').val()+extras,
                    method:'PUT',
                    success:(country)=>{
                        l.stop();
                        $('.close').trigger('click');
                        $('#refreshListsButton').trigger('click');
                    }
                })
            }
        });
    });
    $('#addStartDate').on('change', function(){
        $('#addEndDate').val('');
        $('#addEndDate').datepicker('setStartDate', $('#addStartDate').val());
    })
});

function refreshSchoolList(callback){
    $('#addSchool option').remove();
    $.ajax({
        url:'/find/school',
        method:'GET',
        success: (schools)=>{
            console.log(schools);
            $('#addSchool').removeAttr('disabled');
            schools.forEach(school => {
                newElement = 
                '<option value="'+school.school.id+'">'+school.school.name+'</option>'
                $('#addSchool').append(newElement);
                if(school == schools[schools.length-1]){
                    callback;
                }
            });
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function refreshLanguageList(callback){
    $('#addLanguage option').remove();
    $.ajax({
        url:'/find/language',
        method:'GET',
        success: (languages)=>{
            $('#addLanguage').removeAttr('disabled');
            languages.forEach(language => {
                newElement = 
                '<option value="'+language.id+'">'+language.language+'</option>'
                $('#addLanguage').append(newElement);
                if(language == languages[languages.length-1]){
                    callback;
                }
            });
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function refreshTimeList(callback){
    $('#addTime option').remove();
    $.ajax({
        url:'/find/time',
        method:'GET',
        success: (times)=>{
            $('#addTime').removeAttr('disabled');
            times.forEach(time => {
                newElement = 
                '<option value="'+time.id+'">'+time.time+'</option>'
                $('#addTime').append(newElement);
                if(time == times[times.length-1]){;
                    callback;
                }
            });
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function refreshNewOptions(callback){
    refreshSchoolList(refreshLanguageList(refreshTimeList(callback)));
}
function checkNewProgramBoxes(checks, l, callback){
    $('.modal-content div').removeClass('has-error');
    if($('#addName').val() ==''){
        $('.addNameBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addWeeks').val() ==''){
        $('.addWeeksBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addHours').val() ==''){
        $('.addHoursBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addPrice').val() ==''){
        $('.addPriceBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addSchool option:selected').val() ==undefined){
        $('.addSchoolBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addLanguage option:selected').val() ==undefined){
        $('.addLanguageBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addStartDate').val() ==''){
        $('.addStartDateBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addEndDate').val() ==''){
        $('.addEndDateBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addDescription').val() == ''){
        $('.addDescriptionBox').addClass('has-error');
        l.stop();
        return false;
    }
    var extras = '';
    if(checks[0] == 1){
        if($('#addDiscount').val() ==''){
            $('.addDiscountBox').addClass('has-error');
            l.stop();
            return false;
        }
        else{
            extras = extras + '&discount='+$('#addDiscount').val();
            callback(true, extras);
        }
    }
    else{
        callback(true, extras);
    }
}
function refreshProgramList(callback){
    clearProgramList();
        $.ajax({
            url:'/find/program',
            method: 'GET',
            success: (programs)=>{
                programs.forEach(program => {
                    addProgramToProgramList(program.program, program.stats, program.school);
                    refreshEditProgramSelects(program.program, program.stats);
                });
                SweetAlert.init();
                $('#programsTable').DataTable();
                callback();
            }
        })
}
function addProgramToProgramList(program, stats, school){
    var programStatus = 'Inactive';
    var programStatusInfo = 'danger'
    if(program.status == true){
        programStatus = 'Active'
        programStatusInfo = 'success'
    }
    newLine =
    '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="checkboxes" value="1" /> <span></span> </label> </td> <td> '+program.name+' </td> <td> '+school.name+' </td> <td> <span class="label label-sm label-'+programStatusInfo+'"> '+programStatus+' </span> </td> <td class="center"> '+stats.language+' </td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> Actions <i class="fa fa-angle-down"></i> </button> <ul class="dropdown-menu pull-left" role="menu"> <li> <a id="editProgramShowButton'+program.id+'" data-toggle="modal" href="#programModal'+program.id+'"> <i class="icon-user"></i> Edit </a> </li> <li><a id="removeProgram'+program.id+'" class="">Remove Program</a></li><li><a id="changeStatus'+program.id+'">Change Status</a></li> </ul> </div> </td> </tr>'
    $('#programTable').append(newLine);
    newLine =
    '<div class="modal fade bs-modal-lg" id="programModal'+program.id+'" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">Edit Program --> '+program.name+'</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6 editNameBox'+program.id+'"> <label class="control-label" for="name">Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="editName'+program.id+'" value="'+program.name+'" type="text" placeholder="Name" /> </div> </div> <div class="col-md-6 editSchoolBox'+program.id+'"> <label class="control-label" for="school">School</label> <div class="input-group col-md-12"> <select class="form-control" id="editSchool'+program.id+'"></select> </div> </div> <div class="form-group"></div> <div class="col-md-2 editWeeksBox'+program.id+'"> <label class="control-label" for="weeks">Weeks</label> <div class="input-group-col-md-12"> <input class="form-control" id="editWeeks'+program.id+'" type="number" placeholder="Weeks" value="'+program.weeks+'"/> </div> </div> <div class="form-group"></div> <div class="col-md-2 editHoursBox'+program.id+'"> <label class="control-label" for="hours">Hours/week</label> <div class="input-group-col-md-12"> <input class="form-control" id="editHours'+program.id+'" type="number" placeholder="Hours" value="'+program.hours+'" /> </div> </div> </div> <div class="form-group"> <div class="col-md-4 editLanguageBox'+program.id+'"> <label class="control-label" for="language">Language</label> <div class="input-group col-md-12"> <select class="form-control" id="editLanguage'+program.id+'"> <option hidden="hidden" disabled="disabled">Language...</option> </select> </div> </div> <div class="col-md-4 editPriceBox'+program.id+'"> <label class="control-label" for="price">Price</label> <div class="input-group-col-md-12"> <input class="form-control" id="editPrice'+program.id+'" type="number" placeholder="Price" value="'+program.price+'" /> </div> </div> <div class="col-md-6 editTimeBox'+program.id+'"> <label class="control-label" for="time">Time</label> <div class="input-group col-md-12"> <select class="form-control" id="editTime'+program.id+'"></select> </div> </div> <div class="col-md-12 editStartDateBox'+program.id+'"> <label class="control-label" for="startDate">Start Date</label> <input class="form-control form-control-inline input-medium date-picker" id="editStartDate'+program.id+'" size="16" type="text" data-date-start-date="0d"  value="'+program.startDateMonth+'/'+program.startDateDay+'/'+program.startDateYear+'"/> </div> <div class="col-md-12 editEndDateBox'+program.id+'"> <label class="control-label" for="endDate">End Date</label> <input class="form-control form-control-inline input-medium date-picker" id="editEndDate'+program.id+'" size="16" type="text" data-date-start-date="'+program.startDateMonth+'/'+program.startDateDay+'/'+program.startDateYear+'" value="'+program.endDateMonth+'/'+program.endDateDay+'/'+program.endDateYear+'" /> </div> <div class="col-md-12 editDescriptionBox'+program.id+'"> <label class="control-label" for="adress">Description</label> <div class="input-group col-md-12"> <textarea class="form-control" id="editDescription'+program.id+'" type="text" placeholder="Description..." rows="4">'+program.description+'</textarea> </div> </div> <div class="col-md-6 editDiscountBox'+program.id+'"> <input class="make-switch" id="editDiscountCheck'+program.id+'" type="checkbox" checked="" data-size="normal" /> <label class="control-label" for="discount" style="margin-top:20px; margin-left:10px">Discount</label><span class="input-group d-inline-block"><span class="input-group-addon"><i class="fa fa-chevron-circle-right"></i></span> <input class="form-control" id="editDiscount'+program.id+'" value="'+program.discount+'" type="number" placeholder="Discount (%)" /></span> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button" id="editProgramButton'+program.id+'" data-style="zoom-in"><span class="ladda-label">Save Program</span></button> </div> </div> </div> </div>'
    $('body').append(newLine);
    if(program.discount !='0'){
        $('#editDiscount'+program.id).val(program.discount);
    }
    else{
        $('#editDiscountCheck'+program.id).prop('checked', false);
        $('#editDiscount'+program.id).prop('disabled', 'disabled');
    }
    $('#changeStatus'+program.id).on('click', function(){
        newStatus = 'false';
        if(program.status != true){
            newStatus = 'true';
        }
        $.ajax({
            url:'/find/program?id='+program.id+'&status='+newStatus,
            method:'PATCH',
            success:(data)=>{
                $('#refreshListsButton').trigger('click');
            }
        })
    });
    $('#removeProgram'+program.id).on('click', ()=>{
        swal({
            title: program.name+" ===>Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            type: "warning",
            cancelButtonClass: "btn-default",
            cancelButtonText:"Cancel",
            closeOnCancel:"true",
            closeOnConfirm:"false",
            confirmButtonClass: "btn-success",
            confirmButtonText:"Confirm",
            popupMessageSuccess:"Data is Removed!",
            popupTitleSuccess:"Done!",
            showCancelButton:"true",
            showConfirmButton:"true",
          }, (isConfirm)=>{
              if(isConfirm){
                $.ajax({
                    url:'/program/delete?id='+program.id,
                    method:'DELETE',
                    success: (data)=>{
                        if(data.status=='1'){
                            $('#refreshListsButton').trigger('click');
                        }
                    }
                }).fail((data)=>{
                    console.log('fail: '+data);
                })
              }
              else{
                  console.log('nothing happend.');
              }
          });
        currentProgramId = program.id;
    });
    $('#editDiscountCheck'+program.id).change(()=>{
        if($('#editDiscountCheck'+program.id).prop("checked")){
            $('#editDiscount'+program.id).removeAttr('disabled');
        }
        else{
            $('#editDiscount'+program.id).prop('disabled', 'disabled');
        }
    });
    $('#editProgramButton'+program.id).on('click', function(){
        var l = Ladda.create(this);
        l.start();
        var checks = [0];
        if($('#editDiscountCheck'+program.id).is(':checked')){
            checks[0]=1;
        }
        editProgramCheckEmptyBoxes(program.id, checks, l, (CreateProgramExtras, l)=>{
            console.log('/find/program?id='+program.id+'&name='+$('#editName'+program.id).val()+'&weeks='+$('#editWeeks'+program.id).val()+'&hours='+$('#editHours'+program.id).val()+'&price='+$('#editPrice'+program.id).val()+'&school='+$('#editSchool'+program.id).val()+'&language='+$('#editLanguage'+program.id).val()+'&start='+$('#editStartDate'+program.id).val()+'&end='+$('#editEndDate'+program.id).val()+'&description='+$('#editDescription'+program.id).val()+CreateProgramExtras);
            $.ajax({
                url:'/find/program?id='+program.id+'&name='+$('#editName'+program.id).val()+'&weeks='+$('#editWeeks'+program.id).val()+'&hours='+$('#editHours'+program.id).val()+'&price='+$('#editPrice'+program.id).val()+'&time='+$('#editTime'+program.id).val()+'&school='+$('#editSchool'+program.id).val()+'&language='+$('#editLanguage'+program.id).val()+'&start='+$('#editStartDate'+program.id).val()+'&end='+$('#editEndDate'+program.id).val()+'&description='+$('#editDescription'+program.id).val()+CreateProgramExtras,
                method:'PATCH',
                success:(data)=>{
                    l.stop();
                    $('.close').trigger('click');
                    refreshProgramList(()=>{});
                }
            })
        });
    })
}
function clearProgramList(){
    $('.gradeX').remove();
}
function editProgramCheckEmptyBoxes(id, checks, l, callback){
    $('.modal-content div').removeClass('has-error');
    if($('#editName'+id).val() ==''){
        $('.editNameBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editSchool'+id).text() ==''){
        $('.editSchoolBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editWeeks'+id).val() ==''){
        $('.editWeeksBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editHours'+id).val() ==''){
        $('.editHoursBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editLanguage'+id).text() ==''){
        $('.editLanguageBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editPrice'+id).val() ==''){
        $('.editPriceBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editTime'+id).text() ==''){
        $('.editTimeBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editStartDate'+id).val() ==''){
        $('.editStartDateBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editEndDate'+id).val() ==''){
        $('.editEndDateBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editDescription'+id).val() ==undefined || $('#editDescription'+id).val() == ""){
        $('.editDescriptionBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    var extras = '';
    if(checks[0] == 1){
        if($('#editDiscount'+id).val() ==''){
            $('.editDiscountBox'+id).addClass('has-error');
            l.stop();
            return false;
        }
        else{
            extras = extras + '&discount='+$('#editDiscount'+id).val();
        }
    }
    callback(extras, l);
}

function refreshEditProgramSelects(program, stats){
    $('#editSchool'+program.id+' option').remove();
    $('#editLanguage'+program.id+' option').remove();
    $('#editTime'+program.id+' option').remove();
    var t = 1;
    const promise = new Promise((resolve,reject)=>{
        $.ajax({
            url:'/find/School',
            method:'GET',
            success: (schools)=>{
                schools.forEach(school => {
                    console.log(school.school.name);
                    newElement = 
                    '<option value="'+school.school.id+'">'+school.school.name+'</option>'
                    $('#editSchool'+program.id+'').append(newElement);
                    if(school == schools[schools.length-1]){
                        $('#editSchool'+program.id).val(stats.schoolId);
                        resolve(program, stats);
                    }
                });
            }
        }).fail((data)=>{
            console.log('fail: '+data);
        });
    }).then(()=>{
        $.ajax({
            url:'/find/Language',
            method:'GET',
            success: (languages)=>{
                console.log(languages)
                languages.forEach(language => {
                    newElement = 
                    '<option value="'+language.id+'">'+language.language+'</option>'
                    $('#editLanguage'+program.id+'').append(newElement);
                    if(language == languages[languages.length-1]){
                        $('#editLanguage'+program.id).val(stats.languageId);
                        return('then1 done.');
                    }
                });
            }
        }).fail((data)=>{
            console.log('fail: '+data);
        });
    }).then(()=>{
        $.ajax({
            url:'/find/Time',
            method:'GET',
            success: (times)=>{
                console.log(times);
                times.forEach(time => {
                    newElement = 
                    '<option value="'+time.id+'">'+time.time+'</option>'
                    $('#editTime'+program.id+'').append(newElement);
                    if(time == times[times.length-1]){
                        $('#editTime'+program.id).val(stats.timeId);
                    }
                });
            }
        }).fail((data)=>{
            console.log('fail: '+data);
        });
    })

}