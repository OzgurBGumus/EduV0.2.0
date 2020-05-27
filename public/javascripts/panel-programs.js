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
        console.log('Changed');
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
            console.log(languages);
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
            console.log(times);
            $('#addTime').removeAttr('disabled');
            times.forEach(time => {
                newElement = 
                '<option value="'+time.id+'">'+time.time+'</option>'
                $('#addTime').append(newElement);
                if(time == times[times.length-1]){
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
                    addProgramToProgramList(program.program, program.stats);
                    //refreshEditProgramPlace(program.program, program.stats);
                });
                SweetAlert.init();
                $('#programsTable').DataTable();
                callback();
            }
        })
}
function addProgramToProgramList(program, stats){
    var programStatus = 'Inactive';
    var programStatusInfo = 'danger'
    console.log('status:'+ program.status);
    if(program.status == true){
        programStatus = 'Active'
        programStatusInfo = 'success'
    }
    newLine =
    '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="checkboxes" value="1" /> <span></span> </label> </td> <td> '+program.name+' </td> <td> '+stats.school+' </td> <td> <span class="label label-sm label-'+programStatusInfo+'"> '+programStatus+' </span> </td> <td class="center"> '+stats.language+' </td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> Actions <i class="fa fa-angle-down"></i> </button> <ul class="dropdown-menu pull-left" role="menu"> <li> <a id="editProgramShowButton'+program.id+'" data-toggle="modal" href="#programModal'+program.id+'"> <i class="icon-user"></i> Edit </a> </li> <li><a id="removeProgram'+program.id+'" class="">Remove Program</a></li><li><a id="changeStatus'+program.id+'">Change Status</a></li> </ul> </div> </td> </tr>'
    $('#programTable').append(newLine);
    //newLine =
    //'<div class="modal fade bs-modal-lg" id="programModal'+program.id+'" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">Edit ---> '+program.name+'</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6 editNameBox"'+program.id+'> <label class="control-label" for="name">Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="editName'+program.id+'" type="text" placeholder="Name"  value="'+program.name+'"/> </div> </div> <div class="col-md-6 editURLBox'+school.id+'"> <label class="control-label" for="URL">URL</label> <div class="input-group col-md-12"> <input class="form-control" id="editURL'+school.id+'" type="text" placeholder="URL" value="'+school.URL+'" /> </div> </div> </div> <div class="form-group"> <div class="col-md-6 editEmailBox'+school.id+'"> <label class="control-label" for="email">Email</label> <div class="input-group col-md-12"> <input class="form-control" id="editEmail'+school.id+'" type="email" placeholder="Email" value="'+school.email+'" /> </div> </div> <div class="col-md-6 editPhoneBox'+school.id+'"> <label class="control-label" for="phone">Phone</label> <div class="input-group col-md-12"> <input class="editPhone'+school.id+' form-control" id="editPhone'+school.id+'" type="text" value="'+school.phone+'"/> </div> </div> <div class="col-md-12 editAdressBox'+school.id+'"> <label class="control-label" for="adress">Adress</label> <div class="input-group col-md-12"></div> <input class="form-control" id="editAdress'+school.id+'" type="text" placeholder="Adress" value="'+school.adress+'" /> </div> <div class="col-md-4 editCountryBox'+school.id+'"> <label class="control-label" for="country">Country</label> <div class="input-group col-md-12"> <select class="form-control" id="editCountry'+school.id+'"> <option hidden="hidden" disabled="disabled">Country...</option> </select> </div> </div> <div class="col-md-4 editStateBox'+school.id+'"> <label class="control-label" for="state">State</label> <div class="input-group col-md-12"> <select class="form-control" id="editState'+school.id+'"> <option hidden="hidden" disabled="disabled">State...</option> </select> </div> </div> <div class="col-md-4 editCityBox'+school.id+'"> <label class="control-label" for="city">City</label> <div class="input-group col-md-12"> <select class="form-control" id="editCity'+school.id+'"> <option hidden="hidden" disabled="disabled">City...</option> </select> </div> </div> <div class="col-md-12 editDescriptionBox'+school.id+'"> <label class="control-label" for="adress">Description</label> <div class="input-group col-md-12"> <textarea class="form-control" id="editDescription'+school.id+'" type="text" placeholder="Description..." rows="4" value="">'+school.description+'</textarea> </div> </div> <div class="col-md-12"> <input class="make-switch" id="editAirportCheck'+school.id+'" type="checkbox" checked="" data-size="normal" /> <label class="control-label" for="airport" style="margin-top:20px; margin-left:10px">Airport Pickup</label> <div class="input-group col-md-12 editAirportBox'+school.id+'"><span class="input-group-addon"><i class="fa fa-usd"></i></span> <input class="form-control" id="editAirport'+school.id+'" type="number" placeholder="Airport Pickup Price ($$ USD)" value=""/> </div> </div> <div class="col-md-12"> <input class="make-switch" id="editAccommodationCheck'+school.id+'" type="checkbox" checked="" data-size="normal" /> <label class="control-label" for="accommodation" style="margin-top:20px; margin-left:10px">Accommodation</label> <div class="input-group col-md-12 editAccommodationBox'+school.id+'"><span class="input-group-addon"><i class="fa fa-usd"></i></span> <input class="form-control" id="editAccommodation'+school.id+'" type="number" placeholder="Accommodation Price ($$ USD)" value=""/> </div> </div> <div class="col-md-12"> <input class="make-switch" id="editHInsuranceCheck'+school.id+'" type="checkbox" checked="" data-size="normal" /> <label class="control-label" for="hInsurance" style="margin-top:20px; margin-left:10px">Health Insurance</label> <div class="input-group col-md-12 editHInsuranceBox'+school.id+'"><span class="input-group-addon"><i class="fa fa-usd"></i></span> <input class="form-control" id="editHInsurance'+school.id+'" type="number" placeholder="Health Insurance Price Price ($$ USD)" value="" /> </div> </div> <div class="col-md-12"> <input class="make-switch" id="editDiscountCheck'+school.id+'" type="checkbox" checked="" data-size="normal" /> <label class="control-label" for="discount" style="margin-top:20px; margin-left:10px">Discount</label> <div class="input-group col-md-12 editDiscountBox'+school.id+'"><span class="input-group-addon"><i class="fa fa-usd"></i></span> <input class="form-control editDiscountBox'+school.id+'" id="editDiscount'+school.id+'" type="number" placeholder="Discount Price ($$ USD)" value="" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button" id="editSchoolButton'+school.id+'" data-style="zoom-in"><span class="ladda-label">Save School</span></button> </div> </div> </div> </div>'
    //$('body').append(newLine);
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
    })
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
    /*$('#editDiscountCheck'+school.id).change(()=>{
        if($('#editDiscountCheck'+school.id).prop("checked")){
            $('#editDiscount'+school.id).removeAttr('disabled');
        }
        else{
            $('#editDiscount'+school.id).prop('disabled', 'disabled');
        }
    });*/
    /*$('#editSchoolButton'+school.id).on('click', function(){
        var l = Ladda.create(this);
        l.start();
        var checks = [0,0,0,0];
        if($('#editAirportCheck'+school.id).is(':checked')){
            checks[0]=1;
        }
        if($('#editAccommodationCheck'+school.id).is(':checked')){
            checks[1]=1;
        }
        if($('#editHInsuranceCheck'+school.id).is(':checked')){
            checks[2]=1;
        }
        if($('#editDiscountCheck'+school.id).is(':checked')){
            checks[3]=1;
        }
        editSchoolCheckEmptyBoxes(school.id, checks, l, (CreateSchoolExtras, l)=>{
            console.log('/find/school?id='+school.id+'&url='+$('#editURL'+school.id).val()+'&name='+$('#editName'+school.id).val()+'&email='+$('#editEmail'+school.id).val()+'&country='+$('#editCountry'+school.id).val()+'&state='+$('#editState'+school.id).val()+'&city='+$('#editCity'+school.id).val()+'&description='+$('#editDescription'+school.id).val()+'&adress='+$('#editAdress'+school.id).val()+'&phone='+$('.editPhone'+school.id).val()+CreateSchoolExtras);
            $.ajax({
                url:'/find/school?id='+school.id+'&url='+$('#editURL'+school.id).val()+'&name='+$('#editName'+school.id).val()+'&email='+$('#editEmail'+school.id).val()+'&country='+$('#editCountry'+school.id).val()+'&state='+$('#editState'+school.id).val()+'&city='+$('#editCity'+school.id).val()+'&description='+$('#editDescription'+school.id).val()+'&adress='+$('#editAdress'+school.id).val()+'&phone='+$('.editPhone'+school.id).val()+CreateSchoolExtras,
                method:'PATCH',
                success:(data)=>{
                    l.stop();
                    $('.close').trigger('click');
                    refreshSchoolList(()=>{});
                }
            })
        });
    })*/
}
function clearProgramList(){
    $('.gradeX').remove();
}