$(document).ready(function(){
    refreshLists();
    $('#createNewCountryButton').on('click', ()=>{
        $('.addCountryNameBox').removeClass('has-error');
        if($('#addCountryName').val() == ''){
            $('.addCountryNameBox').addClass('has-error');
        }
        else{
            $.ajax({
                url: '/find/country?country='+$('#addCountryName').val(),
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
                    refreshLists();
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

function refreshLists(){
    $('.gradeX').remove();
    $.ajax({
        url:'/find/country',
        method:'GET',
        success:(data,url)=>{
            var newCountryRow;
            data.forEach(country => {
                console.log(country);
                newCountryRow =
                '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input class="checkboxes" type="checkbox" value="1" /><span></span> </label> </td> <td> '+country.country+' </td> <td><span class="label label-sm label-success"> Approved </span></td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">Actions<i class="fa fa-angle-down"></i></button> <ul class="dropdown-menu pull-left" role="menu"> <li><a data-toggle="modal" href="#'+country.country+'ChangeNameModal">Change Name</a></li><li><a data-toggle="modal" href="#'+country.country+'StateModal">Add State</a></li></ul> </div> <!-- END EXAMPLE TABLE PORTLET--> </td> </tr>'
                $('#countryTable').append(newCountryRow);
                newModal = 
                '<div class="modal fade bs-modal-lg" id="'+country.country+'StateModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+country.country+'] New State</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="'+country.country+'StateNameBox"> <label class="control-label" for="name">Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="'+country.country+'StateName" type="text" placeholder="Name" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="'+country.country+'StateButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Save State</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                $('.page-content').append(newModal);
                newModal = 
                '<div class="modal fade bs-modal-lg" id="'+country.country+'ChangeNameModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+country.country+'] Change Country Name</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="'+country.country+'ChangeNameBox"> <label class="control-label" for="name">New Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="'+country.country+'ChangeName" type="text" placeholder="NewName" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="'+country.country+'ChangeNameButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Change Name</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                $('.page-content').append(newModal);
                $('#'+country.country+'StateButton').unbind().on('click', function(){
                    if($('#'+country.country+'StateName').val() == ''){
                        $('#'+country.country+'StateNameBox').addClass('has-error');
                    }
                    else{
                        newState(country.country, $('#'+country.country+'StateName').val());
                        $('.close').trigger('click');
                        refreshLists();
                    }
                });
                $('#'+country.country+'ChangeNameButton').unbind().on('click', function(){
                    debugger;
                    if($('#'+country.country+'ChangeName').val() == ''){
                        $('#'+country.country+'ChangeNameBox').addClass('has-error');
                    }
                    else{
                        console.log('1');
                        changeCountryName(country.country, $('#'+country.country+'ChangeName').val());
                    }
                });
            });
            $('#countryTableBox').DataTable();
        }
    })
    $.ajax({
        url:'/find/state',
        method:'GET',
        success:(data,url)=>{
            console.log(data);
            var newStateRow;
            data.forEach(element => {
                newStateRow =
                '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input class="checkboxes" type="checkbox" value="1" /><span></span> </label> </td> <td> '+element[1].state+' </td> <td>'+element[0].country+'</td> <td><span class="label label-sm label-success"> Approved </span></td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">Actions<i class="fa fa-angle-down"></i></button> <ul class="dropdown-menu pull-left" role="menu"> <li><a data-toggle="modal" href="#'+element[1].state+'ChangeNameModal">Change Name</a></li><li><a data-toggle="modal" href="#'+element[1].state+'CityModal">Add City</a></li><li><a class="">Remove State</a></li> </ul> </div> <!-- END EXAMPLE TABLE PORTLET--> </td> </tr>'
                $('#stateTable').append(newStateRow);
                newModal = 
                '<div class="modal fade bs-modal-lg" id="'+element[1].state+'CityModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+element[1].state+'] New City</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="'+element[1].state+'CityNameBox"> <label class="control-label" for="name">Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="'+element[1].state+'CityName" type="text" placeholder="Name" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="'+element[1].state+'CityButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Save State</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                $('.page-content').append(newModal);
                newModal = 
                '<div class="modal fade bs-modal-lg" id="'+element[1].state+'ChangeNameModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+element[1].state+'] Change State Name</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="'+element[1].state+'ChangeNameBox"> <label class="control-label" for="name">New Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="'+element[1].state+'ChangeName" type="text" placeholder="NewName" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="'+element[1].state+'ChangeNameButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Change Name</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                $('.page-content').append(newModal);
                $('#'+element[1].state+'CityButton').unbind().on('click', function(){
                    if($('#'+element[1].state+'CityName').val() == ''){
                        $('#'+element[1].state+'CityNameBox').addClass('has-error');
                    }
                    else{
                        newCity(element[1].state, $('#'+element[1].state+'CityName').val());
                    }
                });
                $('#'+element[1].state+'ChangeNameButton').unbind().on('click', function(){
                    debugger;
                    if($('#'+element[1].state+'ChangeName').val() == ''){
                        $('#'+element[1].state+'ChangeNameBox').addClass('has-error');
                    }
                    else{
                        console.log('1');
                        changeStateName(element[1].state, $('#'+element[1].state+'ChangeName').val());
                    }
                });
            });
            $('#stateTableBox').DataTable();
        }
    })
    $.ajax({
        url:'/find/city',
        method:'GET',
        success:(data,url)=>{
            debugger;
            var newCityRow;
            data.forEach(element => {
                newCityRow =
                '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input class="checkboxes" type="checkbox" value="1" /><span></span> </label> </td> <td> '+element[2].city+' </td> <td>'+element[1].state+'</td> <td>'+element[0].country+'</td> <td><span class="label label-sm label-success"> Approved </span></td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">Actions<i class="fa fa-angle-down"></i></button> <ul class="dropdown-menu pull-left" role="menu"> <li><a data-toggle="modal" href="#'+element[2].city+'ChangeNameModal">Change Name</a></li><li><a data-toggle="confirmation" data-original-title="Are you sure ?" title="">Remove City</a></li> </ul> </div> <!-- END EXAMPLE TABLE PORTLET--> </td> </tr>'
                $('#cityTable').append(newCityRow);
                newModal =
                '<div class="modal fade bs-modal-lg" id="'+element[2].city+'ChangeNameModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+element[2].city+'] Change City Name</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="'+element[2].city+'ChangeNameBox"> <label class="control-label" for="name">New Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="'+element[2].city+'ChangeName" type="text" placeholder="NewName" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="'+element[2].city+'ChangeNameButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Change Name</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                $('.page-content').append(newModal);
                $('#'+element[2].city+'ChangeNameButton').unbind().on('click', function(){
                    debugger;
                    if($('#'+element[2].city+'ChangeName').val() == ''){
                        $('#'+element[2].city+'ChangeNameBox').addClass('has-error');
                    }
                    else{
                        console.log('1');
                        changeCityName(element[2].city, $('#'+element[2].city+'ChangeName').val());
                    }
                });
            });
            $('#cityTableBox').DataTable();
        }
    })
}
function newState(country, name){
    $.ajax({
        url:'/find/state?state='+name+'&country='+country,
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
                    refreshLists();
        }
    })
}
function newCity(state, name){
    $.ajax({
        url:'/find/city?city='+name+'&state='+state,
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
                    $('#'+state+'StateName').val('');
                    refreshLists();
        }
    })
}
function changeCountryName(country, name){
    console.log(country);
    $.ajax({
        url:'/find/country?country='+country+'&name='+name,
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
                    $('#'+country+'ChangeName').val('');
                    refreshLists();
        }
    })
}
function changeStateName(state, name){
    console.log(state);
    $.ajax({
        url:'/find/state?state='+state+'&name='+name,
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
                    $('#'+state+'ChangeName').val('');
                    refreshLists();
        }
    })
}
function changeCityName(city, name){
    $.ajax({
        url:'/find/city?city='+city+'&name='+name,
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
                    $('#'+city+'ChangeName').val('');
                    refreshLists();
        }
    })
}