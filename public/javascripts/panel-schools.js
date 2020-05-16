$(document).ready(function(){
    var currentSchoolId = 0;
    refreshSchoolList();
    $('#airportCheck').on('click', ()=>{
        console.log('test');
    });
    $('#createNewSchoolButton').on('click', function(){
        var l = Ladda.create(this);
        l.start();
        var checks = [0,0,0,0];
        if($('.bootstrap-switch-id-airportCheck').hasClass('bootstrap-switch-on')){
            checks[0]=1;
        }
        if($('.bootstrap-switch-id-accommodationCheck').hasClass('bootstrap-switch-on')){
            checks[1]=1;
        }
        if($('.bootstrap-switch-id-hInsuranceCheck').hasClass('bootstrap-switch-on')){
            checks[2]=1;
        }
        if($('.bootstrap-switch-id-discountCheck').hasClass('bootstrap-switch-on')){
            checks[3]=1;
        }
        newSchoolCheckEmptyBoxes(checks, l, (CreateSchoolExtras, l)=>{
            console.log('/find/school?URL='+$('#addURL').val()+'&name='+$('#addName').val()+'&description='+$('#addDescription').val()+'&adress='+$('#addAdress').val()+'&phone='+$('.addPhone').val()+CreateSchoolExtras);
            $.ajax({
                url:'/find/school?URL='+$('#addURL').val()+'&name='+$('#addName').val()+'&email='+$('#addEmail').val()+'&country='+$('#addCountry').val()+'&state='+$('#addState').val()+'&city='+$('#addCity').val()+'&description='+$('#addDescription').val()+'&adress='+$('#addAdress').val()+'&phone='+$('.addPhone').val()+CreateSchoolExtras,
                method:'PUT',
                success:(country)=>{
                    console.log(country);
                    l.stop();
                    $('.close').trigger('click');
                    refreshSchoolList();
                }
            })
        });
    });
    refreshNewSchoolCountries();
    //refreshNewSchoolStates();
    //refreshNewSchoolCitys();
    $('#addCountry').on('change', function(){
        refreshNewSchoolStates();
    });
    $('#addState').on('change', function(){
        refreshNewSchoolCitys();
    });
})
function refreshSchoolList(){
        $.ajax({
            url:'/find/school',
            method: 'GET',
            success: (schools)=>{
                clearSchoolList();
                schools.forEach(school => {
                    addSchoolToSchoolList(school);
                });
                SweetAlert.init();
            }
        })
}
function addSchoolToSchoolList(school){
    newLine =
    '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="checkboxes" value="1" /> <span></span> </label> </td> <td> '+school.name+' </td> <td> <a href="mailto:'+school.email+'"> '+school.email+' </a> </td> <td> <span class="label label-sm label-success"> Approved </span> </td> <td class="center"> USA </td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> Actions <i class="fa fa-angle-down"></i> </button> <ul class="dropdown-menu pull-left" role="menu"> <li> <a href="javascript:;"> <i class="icon-user"></i> Edit </a> </li> <li><a id="removeSchool'+school.id+'" class="">Remove School</a></li> </ul> </div> </td> </tr>'
    $('#schoolTable').append(newLine);
    $('#removeSchool'+school.id).on('click', ()=>{
        swal("Are You Sure?", "Once deleted, you will not be able to recover this Data.", "info");
        currentSchoolId = school.id;
        console.log(currentSchoolId);
    });
}
function clearSchoolList(){
    $('.gradeX').remove();
}
function newSchoolCheckEmptyBoxes(checks, l, callback){
    $('.modal-content div').removeClass('has-error');
    if($('#addName').val() ==''){
        $('.addNameBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addURL').val() ==''){
        $('.addURLBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addEmail').val() ==''){
        $('.addEmailBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addAdress').val() ==''){
        $('.addAdressBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addCountry').val() ==''){
        $('.addCountryBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('.addPhone').val() ==''){
        $('.addPhoneBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addState option:selected').val() ==undefined){
        $('.addStateBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addCity option:selected').val() ==undefined){
        $('.addCityBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('#addDescription').val() ==undefined){
        $('.addDescriptionBox').addClass('has-error');
        l.stop();
        return false;
    }
    var extras = '';
    if(checks[0] == 1){
        if($('#addAirport').val() ==''){
            $('.addAirportBox').addClass('has-error');
            l.stop();
            return false;
        }
        else{
            extras = extras + '&airport='+$('#addAirport').val();
        }
    }
    if(checks[1] == 1){
        if($('#addAccommodation').val() ==''){
            $('.addAccommodationBox').addClass('has-error');
            l.stop();
            return false;
        }
        else{
            extras = extras + '&accommodation='+$('#addAccommodation').val();
        }
    }
    if(checks[2] == 1){
        if($('addHInsurance').val() ==''){
            $('.addHInsuranceBox').addClass('has-error');
            l.stop();
            return false;
        }
        else{
            extras = extras + '&hInsurance='+$('#addHInsurance').val();
        }
        
    }
    if(checks[3] == 1){
        if($('addDiscount').val() ==''){
            $('.addDiscountBox').addClass('has-error');
            l.stop();
            return false;
        }
        else{
            extras = extras + '&discount='+$('#addDiscount').val();
        }
    }
    callback(extras, l);
}
function refreshNewSchoolCountries(){
    $('#addCountries option').remove();
    $('#addState').attr('disabled', 'disabled');
    $('#addState option').remove();
    $('#addCity').attr('disabled', 'disabled');
    $('#addCity option').remove();
    $.ajax({
        url:'/find/country',
        method:'GET',
        success: (countries)=>{
            countries.forEach(country => {
                newElement = 
                '<option>'+country.country+'</option>'
                $('#addCountry').append(newElement);
            });
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function refreshNewSchoolStates(){
    $('#addState option').remove();
    $('#addCity').attr('disabled', 'disabled');
    $('#addCity option').remove();
    $.ajax({
        url:'/find/state?country='+$('#addCountry').val(),
        method:'GET',
        success: (states)=>{
            console.log(states);
            states.forEach(state => {
                newElement = 
                '<option>'+state.state+'</option>'
                $('#addState').append(newElement);
                $('#addState').removeAttr('disabled');
            });
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function refreshNewSchoolCitys(){
    $('#addCity option').remove();
    $.ajax({
        url:'/find/city?state='+$('#addState').val(),
        method:'GET',
        success: (citys)=>{
            console.log(citys);
            citys.forEach(city => {
                newElement = 
                '<option>'+city.city+'</option>'
                $('#addCity').append(newElement);
                $('#addCity').removeAttr('disabled');
            });
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}