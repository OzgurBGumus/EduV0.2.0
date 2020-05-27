$(document).ready(function(){
    $('#refreshListsButton').on('click', function(){
        var l = Ladda.create(this);
        l.start();
        refreshLists(()=>{
            l.stop();
        })  
    });
    $('#refreshListsButton').trigger('click');
    $('#createNewCountryButton').on('click', ()=>{
        $('.addCountryNameBox').removeClass('has-error');
        if($('#addCountryName').val() == ''){
            $('.addCountryNameBox').addClass('has-error');
        }
        else{
            var stateRadioText = '';
            if($('#statesRadioButton').prop("checked")){
                stateRadioText = '&stateStatus=1';
            }
            else{
                stateRadioText = '&stateStatus=0';
            }
            $.ajax({
                url: '/find/country?country='+$('#addCountryName').val()+stateRadioText,
                method: 'PUT',
                success:(data,url)=>{
                    $('#addCountryName').val('');
                    $('#closeCreateNewCountry').trigger('click');
                    App.alert({ container: '#alertContainer',
                        type: 'success',
                        message:'Country Is Created...',
                        icon:'check', // alerts parent container place: 'append', // append or prepent in container type: 'success', // alert's type message: 'Test alert', // alert's message
                        close: true, // make alert closable reset: false, // close all previouse alerts first focus: true, // auto scroll to the alert after shown closeInSeconds: 10000, // auto close after defined seconds
                        icon: 'fa fa-check' // put icon class before the message });
                    });
                    refreshLists(()=>{});
                }
            }).fail((data)=>{
                console.log('PUT /find/country/ fail:::'+data);
                App.alert({ container: '#alertContainer',
                        type: 'danger',
                        message:'Country Couldnt Created...',// alerts parent container place: 'append', // append or prepent in container type: 'success', // alert's type message: 'Test alert', // alert's message
                        close: true, // make alert closable reset: false, // close all previouse alerts first focus: true, // auto scroll to the alert after shown closeInSeconds: 10000, // auto close after defined seconds
                        //icon: 'fa fa-check' // put icon class before the message });
                    });
            });
        }
    });
});
// STATE.ADDCITY BAZEN [GENEL] ÇALIŞMIYOR
// CITYLER DOGRU STATEYE KAYDEDILMIYOR
// COUNTRY OLUSTURULDUGUNDA AYNI ISIMDE CITYDE OLUSMALI.
function refreshCountries(callback){
    $.ajax({
        url:'/find/country',
        method:'GET',
        success:(data,url)=>{
            var newCountryRow;
            data.forEach(country => {
                if(country.stateStatus == 1){
                    newCountryRow =
                    '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input class="checkboxes" type="checkbox" value="1" /><span></span> </label> </td> <td> '+country.country+' </td> <td><span class="label label-sm label-success"> Approved </span></td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">Actions<i class="fa fa-angle-down"></i></button> <ul class="dropdown-menu pull-left" role="menu"> <li><a data-toggle="modal" href="#'+country.id+'ChangeNameCountryModal">Change Name</a></li><li><a data-toggle="modal" href="#'+country.id+'StateModal">Add State</a></li><li><a id="removeCountry'+country.id+'" class="">Remove Country</a></li> </ul> </div> <!-- END EXAMPLE TABLE PORTLET--> </td> </tr>'
                    $('#countryTable').append(newCountryRow);
                    newModal = 
                    '<div class="modal fade bs-modal-lg" id="'+country.id+'StateModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+country.country+'] New State</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="'+country.id+'StateNameBox"> <label class="control-label" for="name">Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="'+country.id+'StateName" type="text" placeholder="Name" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="'+country.id+'StateButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Save State</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                    $('.page-content').append(newModal);
                }
                else{
                    newCountryRow =
                    '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input class="checkboxes" type="checkbox" value="1" /><span></span> </label> </td> <td> '+country.country+' </td> <td><span class="label label-sm label-success"> Approved </span></td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">Actions<i class="fa fa-angle-down"></i></button> <ul class="dropdown-menu pull-left" role="menu"> <li><a data-toggle="modal" href="#'+country.id+'ChangeNameCountryModal">Change Name</a></li><li><a data-toggle="modal" href="#country'+country.id+'CityModal">Add City</a></li><li><a id="removeCountry'+country.id+'" class="">Remove Country</a></li> </ul> </div> <!-- END EXAMPLE TABLE PORTLET--> </td> </tr>'
                    $('#countryTable').append(newCountryRow);
                    //Country ADD CITY MODAL
                    newModal = 
                    '<div class="modal fade bs-modal-lg" id="country'+country.id+'CityModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+country.country+'] New City</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="country'+country.id+'CityNameBox"> <label class="control-label" for="name">Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="country'+country.id+'CityName" type="text" placeholder="Name" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="country'+country.id+'CityButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Save City</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                    $('.page-content').append(newModal);
                    //Country ADD CITY MODAL END
                    $('#country'+country.id+'CityButton').on('click', function(){
                        if($('#country'+country.id+'CityName').val() == ''){
                            $('#country'+country.id+'CityNameBox').addClass('has-error');
                        }
                        else{
                            newCity(0, country.id, $('#country'+country.id+'CityName').val());
                        }
                    });
                }
                $('#removeCountry'+country.id).on('click', ()=>{
                    swal({
                        title: country.country+" ===>Are you sure?",
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
                                url:'/country/delete?id='+country.id,
                                method:'DELETE',
                                success: (data)=>{
                                    refreshLists(()=>{});
                                }
                            }).fail((data)=>{
                                console.log('fail: '+data);
                            })
                          }
                          else{
                              console.log('nothing happend.');
                          }
                      });
                });
                //COUNTRY CHANGE NAME MODAL
                newModal = 
                '<div class="modal fade bs-modal-lg" id="'+country.id+'ChangeNameCountryModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+country.country+'] Change Country Name</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="'+country.id+'ChangeNameCountryBox"> <label class="control-label" for="name">New Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="'+country.id+'ChangeNameCountry" type="text" placeholder="NewName" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="'+country.id+'ChangeNameCountryButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Change Name</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                $('.page-content').append(newModal);
                //COUNTRY CHANGE NAME MODAL END
                $('#'+country.id+'StateButton').unbind().on('click', function(){
                    if($('#'+country.id+'StateName').val() == ''){
                        $('#'+country.id+'StateNameBox').addClass('has-error');
                    }
                    else{
                        newState(country.id, $('#'+country.id+'StateName').val());
                        $('.close').trigger('click');
                        refreshLists(()=>{});
                    }
                });
                $('#'+country.id+'ChangeNameCountryButton').unbind().on('click', function(){
                    debugger;
                    if($('#'+country.id+'ChangeNameCountry').val() == ''){
                        $('#'+country.id+'ChangeNameCountryBox').addClass('has-error');
                    }
                    else{
                        changeCountryName(country.id, $('#'+country.id+'ChangeNameCountry').val());
                    }
                });
            });
            $('#countryTableBox').DataTable();
            console.log('countries refreshed/');
            callback;
        }
    });
}
function refreshStates(callback){
    $.ajax({
        url:'/find/state',
        method:'GET',
        success:(data,url)=>{
            var newStateRow;
            data.forEach(element => {
                newStateRow =
                '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input class="checkboxes" type="checkbox" value="1" /><span></span> </label> </td> <td> '+element[1].state+' </td> <td>'+element[0].country+'</td> <td><span class="label label-sm label-success"> Approved </span></td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">Actions<i class="fa fa-angle-down"></i></button> <ul class="dropdown-menu pull-left" role="menu"> <li><a data-toggle="modal" href="#'+element[1].id+'ChangeNameStateModal">Change Name</a></li><li><a data-toggle="modal" href="#'+element[1].id+'CityModal">Add City</a></li><li><a id="removeState'+element[1].id+'" class="">Remove State</a></li> </ul> </div> <!-- END EXAMPLE TABLE PORTLET--> </td> </tr>'
                $('#stateTable').append(newStateRow);
                $('#removeState'+element[1].id).on('click', ()=>{
                    swal({
                        title: element[1].state+" ===>Are you sure?",
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
                                url:'/state/delete?id='+element[1].id,
                                method:'DELETE',
                                success: (data)=>{
                                    refreshLists(()=>{});
                                }
                            }).fail((data)=>{
                                console.log('fail: '+data);
                            })
                          }
                          else{
                              console.log('nothing happend.');
                          }
                      });
                });
                // STATE ADD CITY MODAL
                newModal = 
                '<div class="modal fade bs-modal-lg" id="'+element[1].id+'CityModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+element[1].state+'] New City</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="'+element[1].id+'CityNameBox"> <label class="control-label" for="name">Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="'+element[1].id+'CityName" type="text" placeholder="Name" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="'+element[1].id+'CityButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Save State</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                $('.page-content').append(newModal);
                // STATE ADD CITY MODAL END

                // STATE CHANGE NAME MODAL
                newModal = 
                '<div class="modal fade bs-modal-lg" id="'+element[1].id+'ChangeNameStateModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+element[1].state+'] Change State Name</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="'+element[1].id+'ChangeNameStateBox"> <label class="control-label" for="name">New Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="'+element[1].id+'ChangeNameState" type="text" placeholder="NewName" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="'+element[1].id+'ChangeNameStateButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Change Name</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                $('.page-content').append(newModal);
                // STATE CHANGE NAME MODAL END

                $('#'+element[1].id+'CityButton').on('click', function(){
                    if($('#'+element[1].id+'CityName').val() == ''){
                        $('#'+element[1].id+'CityNameBox').addClass('has-error');
                    }
                    else{
                        newCity(1, element[1].id, $('#'+element[1].id+'CityName').val());
                    }
                });
                $('#'+element[1].id+'ChangeNameStateButton').unbind().on('click', function(){
                    debugger;
                    if($('#'+element[1].id+'ChangeNameState').val() == ''){
                        $('#'+element[1].id+'ChangeNameStateBox').addClass('has-error');
                    }
                    else{
                        changeStateName(element[1].id, $('#'+element[1].id+'ChangeNameState').val());
                    }
                });
            });
            $('#stateTableBox').DataTable();
            console.log('states refreshed/');
            callback;
        }
    })
}
function refreshCities(callback){
    $.ajax({
        url:'/find/city',
        method:'GET',
        success:(data,url)=>{
            var newCityRow;
            data.forEach(element => {
                if(element.length > 2){
                    newCityRow =
                    '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input class="checkboxes" type="checkbox" value="1" /><span></span> </label> </td> <td> '+element[2].city+' </td> <td>'+element[1].state+'</td> <td>'+element[0].country+'</td> <td><span class="label label-sm label-success"> Approved </span></td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">Actions<i class="fa fa-angle-down"></i></button> <ul class="dropdown-menu pull-left" role="menu"> <li><a data-toggle="modal" href="#'+element[2].id+'ChangeNameCityModal">Change Name</a></li><li><a id="removeCity'+element[2].id+'" class="">Remove City</a></li> </ul> </div> <!-- END EXAMPLE TABLE PORTLET--> </td> </tr>'
                    $('#cityTable').append(newCityRow);
                    $('#removeCity'+element[2].id).on('click', ()=>{
                        swal({
                            title: element[2].city+" ===>Are you sure?",
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
                                    url:'/city/delete?id='+element[2].id,
                                    method:'DELETE',
                                    success: (data)=>{
                                        refreshLists(()=>{});
                                    }
                                }).fail((data)=>{
                                    console.log('fail: '+data);
                                })
                            }
                            else{
                                console.log('nothing happend.');
                            }
                        });
                    });
                    newModal =
                    '<div class="modal fade bs-modal-lg" id="'+element[2].id+'ChangeNameCityModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+element[2].city+'] Change City Name</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="'+element[2].id+'ChangeNameCityBox"> <label class="control-label" for="name">New Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="'+element[2].id+'ChangeNameCity" type="text" placeholder="NewName" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="'+element[2].id+'ChangeNameCityButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Change Name</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                    $('.page-content').append(newModal);
                    $('#'+element[2].id+'ChangeNameCityButton').unbind().on('click', function(){
                        if($('#'+element[2].id+'ChangeNameCity').val() == ''){
                            $('#'+element[2].id+'ChangeNameCityBox').addClass('has-error');
                        }
                        else{
                            changeCityName(element[2].id, $('#'+element[2].id+'ChangeNameCity').val());
                        }
                    });
                }
                else{
                    newCityRow =
                    '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input class="checkboxes" type="checkbox" value="1" /><span></span> </label> </td> <td> '+element[1].city+' </td> <td></td> <td>'+element[0].country+'</td> <td><span class="label label-sm label-success"> Approved </span></td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">Actions<i class="fa fa-angle-down"></i></button> <ul class="dropdown-menu pull-left" role="menu"> <li><a data-toggle="modal" href="#'+element[1].id+'ChangeNameCityModal">Change Name</a></li><li><a id="removeCity'+element[1].id+'" class="">Remove City</a></li> </ul> </div> <!-- END EXAMPLE TABLE PORTLET--> </td> </tr>'
                    $('#cityTable').append(newCityRow);
                    $('#removeCity'+element[1].id).on('click', ()=>{
                        swal({
                            title: element[1].city+" ===>Are you sure?",
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
                                    url:'/city/delete?id='+element[1].id,
                                    method:'DELETE',
                                    success: (data)=>{
                                        refreshLists(()=>{});
                                    }
                                }).fail((data)=>{
                                    console.log('fail: '+data);
                                })
                            }
                            else{
                                console.log('nothing happend.');
                            }
                        });
                    });
                    newModal =
                    '<div class="modal fade bs-modal-lg" id="'+element[1].id+'ChangeNameCityModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+element[1].city+'] Change City Name</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="'+element[1].id+'ChangeNameCityBox"> <label class="control-label" for="name">New Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="'+element[1].id+'ChangeNameCity" type="text" placeholder="NewName" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="'+element[1].id+'ChangeNameCityButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Change Name</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                    $('.page-content').append(newModal);
                    $('#'+element[1].id+'ChangeNameCityButton').unbind().on('click', function(){
                        if($('#'+element[1].id+'ChangeNameCity').val() == ''){
                            $('#'+element[1].id+'ChangeNameCityBox').addClass('has-error');
                        }
                        else{
                            changeCityName(element[1].id, $('#'+element[1].id+'ChangeNameCity').val());
                        }
                    });
                }
            });
            $('#cityTableBox').DataTable();
            console.log('cities Refreshed.');
            callback();
        }
    })
}
function refreshLists(callback){
    $('.gradeX').remove();
    var rCities = refreshCities;
    var rStates = refreshStates;
    console.log('lists refreshed/');
    var rCountries = refreshCountries(rStates(rCities(callback)));
}
function newState(countryId, name){
    $.ajax({
        url:'/find/state?state='+name+'&countryId='+countryId,
        method:'PUT',
        success:(data,url)=>{
            $('.closeModal').trigger('click');
            App.alert({ container: '#alertContainer',
                        type: 'success',
                        message: data.state+' Is Created...',
                        icon:'check', // alerts parent container place: 'append', // append or prepent in container type: 'success', // alert's type message: 'Test alert', // alert's message
                        close: true, // make alert closable reset: false, // close all previouse alerts first focus: true, // auto scroll to the alert after shown closeInSeconds: 10000, // auto close after defined seconds
                        icon: 'fa fa-check' // put icon class before the message });
                    });
                    $('#'+country+'StateName').val('');
                    refreshLists(()=>{});
        }
    })
}

//owner ==> '0' is belong to countries, '1' is belong to states
function newCity(owner, ownerId, name){
    if(owner == 0){
        $.ajax({
            url:'/find/city?city='+name+'&countryId='+ownerId,
            method:'PUT',
            success:(data,url)=>{
                $('.closeModal').trigger('click');
                App.alert({ container: '#alertContainer',
                            type: 'success',
                            message: data.city+' Is Created...',
                            icon:'check', // alerts parent container place: 'append', // append or prepent in container type: 'success', // alert's type message: 'Test alert', // alert's message
                            close: true, // make alert closable reset: false, // close all previouse alerts first focus: true, // auto scroll to the alert after shown closeInSeconds: 10000, // auto close after defined seconds
                            icon: 'fa fa-check' // put icon class before the message });
                        });
                        $('#country'+ownerId+'CityName').val('');
                        refreshLists(()=>{});
            }
        })
    }
    else if(owner == 1){
        $.ajax({
            url:'/find/city?city='+name+'&stateId='+ownerId,
            method:'PUT',
            success:(data,url)=>{
                $('.closeModal').trigger('click');
                App.alert({ container: '#alertContainer',
                            type: 'success',
                            message: data.city+' Is Created...',
                            icon:'check', // alerts parent container place: 'append', // append or prepent in container type: 'success', // alert's type message: 'Test alert', // alert's message
                            close: true, // make alert closable reset: false, // close all previouse alerts first focus: true, // auto scroll to the alert after shown closeInSeconds: 10000, // auto close after defined seconds
                            icon: 'fa fa-check' // put icon class before the message });
                        });
                        $('#'+ownerId+'CityName').val('');
                        refreshLists(()=>{});
            }
        })
    }
}
function changeCountryName(countryId, name){
    $.ajax({
        url:'/find/country?countryId='+countryId+'&name='+name,
        method:'PATCH',
        success:(data,url)=>{
            $('.closeModal').trigger('click');
            App.alert({ container: '#alertContainer',
                        type: 'success',
                        message: data+' Is Changed...',
                        icon:'check', // alerts parent container place: 'append', // append or prepent in container type: 'success', // alert's type message: 'Test alert', // alert's message
                        close: true, // make alert closable reset: false, // close all previouse alerts first focus: true, // auto scroll to the alert after shown closeInSeconds: 10000, // auto close after defined seconds
                        icon: 'fa fa-check' // put icon class before the message });
                    });
                    $('#'+country+'ChangeNameCountry').val('');
                    refreshLists(()=>{});
        }
    })
}
function changeStateName(stateId, name){
    $.ajax({
        url:'/find/state?stateId='+stateId+'&name='+name,
        method:'PATCH',
        success:(data,url)=>{
            $('.closeModal').trigger('click');
            App.alert({ container: '#alertContainer',
                        type: 'success',
                        message: data+' Is Changed...',
                        icon:'check', // alerts parent container place: 'append', // append or prepent in container type: 'success', // alert's type message: 'Test alert', // alert's message
                        close: true, // make alert closable reset: false, // close all previouse alerts first focus: true, // auto scroll to the alert after shown closeInSeconds: 10000, // auto close after defined seconds
                        icon: 'fa fa-check' // put icon class before the message });
                    });
                    $('#'+stateId+'ChangeNameState').val('');
                    refreshLists(()=>{});
        }
    })
}
function changeCityName(cityId, name){
    $.ajax({
        url:'/find/cityId?city='+cityId+'&name='+name,
        method:'PATCH',
        success:(data,url)=>{
            $('.closeModal').trigger('click');
            App.alert({ container: '#alertContainer',
                        type: 'success',
                        message: data+' Is Changed...',
                        icon:'check', // alerts parent container place: 'append', // append or prepent in container type: 'success', // alert's type message: 'Test alert', // alert's message
                        close: true, // make alert closable reset: false, // close all previouse alerts first focus: true, // auto scroll to the alert after shown closeInSeconds: 10000, // auto close after defined seconds
                        icon: 'fa fa-check' // put icon class before the message });
                    });
                    $('#'+cityId+'ChangeNameCity').val('');
                    refreshLists(()=>{});
        }
    })
}