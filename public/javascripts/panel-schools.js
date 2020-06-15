var newSchoolId = '';
var forCreation = [];
$(document).ready(function(){
    var currentSchoolId = 0;
    $('#refreshListsButton').on('click', function(){
        var l = Ladda.create(this);
        l.start();
        refreshNewSchoolCountries();
        refreshSchoolList(()=>{
            l.stop();
        });
    })
    $('#refreshListsButton').trigger('click');
    $('#airportCheck').on('click', ()=>{
    });
    Dropzone.options.logoDropzone ={
        maxFiles: 1,
        acceptedFiles: "image/*",
        autoProcessQueue: false,
        url:'/find/logo',
        init: function() {
            this.on("processing", function(file) {
                this.options.url = "/find/logo?schoolId="+newSchoolId;
            });
            this.on("queuecomplete", function (file) {
                this.removeAllFiles();
            });
        },
        
    }
    Dropzone.options.schoolImagesDropzone ={
        acceptedFiles: "image/*",
        autoProcessQueue: false,
        url:'/find/images',
        parallelUploads: 1,
        init: function() {
            this.on("processing", function(file) {
                this.options.url = "/find/image?schoolId="+newSchoolId;
            });
            this.on("success", function(file){
                this.processQueue();
            })
            this.on("queuecomplete", function (file) {
                this.removeAllFiles();
            });
        }
    }
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
            var nState ='none';
            var nCity = 'none';
            if($('#addState').text() != ''){
                nState = $('#addState').val();
            }
            if($('#addCity').text() != ''){
                nCity = $('#addCity').val();
            }
            $.ajax({
                url:'/find/school?url='+$('#addURL').val()+'&name='+$('#addName').val()+'&email='+$('#addEmail').val()+'&countryId='+$('#addCountry').val()+'&stateId='+nState+'&cityId='+nCity+'&description='+$('#addDescription').val()+'&adress='+$('#addAdress').val()+'&phone='+$('.addPhone').val()+CreateSchoolExtras,
                method:'PUT',
                success:(data)=>{
                    newSchoolId = data.schoolId;
                    var logoDropzone = Dropzone.forElement("#logoDropzone");
                    var schoolImagesDropzone = Dropzone.forElement('#schoolImagesDropzone');
                    logoDropzone.processQueue();
                    schoolImagesDropzone.processQueue();
                    l.stop();
                    $('.close').trigger('click');
                    clearNewSchool();
                    $('#refreshListsButton').trigger('click');
                }
            });
        });
    });
    //refreshNewSchoolStates();
    //refreshNewSchoolCitys();
    $('#addCountry').on('change', function(){
        $('.addStateBox').hide();
        $('.addCityBox').hide();
        refreshNewSchoolStates();
    });
    $('#addState').on('change', function(){
        $('.addCityBox').hide();
        refreshNewSchoolCitys();
    });
})
function refreshSchoolList(callback){
    $('#addNew').hide();
    clearSchoolList();
        $.ajax({
            url:'/find/school',
            method: 'GET',
            success: (schools)=>{
                schools.forEach(school => {
                    addSchoolToSchoolList(school.school, school.place, school.images);
                    refreshEditSchoolPlace(school.school, school.place);
                });
                SweetAlert.init();
                $('#addNew').show();
                $('#schoolsTable').DataTable();
                callback();
            }
        })
}
function addSchoolToSchoolList(school, place, images){
    var schoolStatus = 'Inactive';
    var schoolStatusInfo = 'danger'
    if(school.status == true){
        schoolStatus = 'Active'
        schoolStatusInfo = 'success'
    }
    var schoolPlace = '';
    if(place.country){
        schoolPlace = schoolPlace + place.country
    }
    if(place.state){
        schoolPlace = schoolPlace +' / '+ place.state
    }
    if(place.city){
        schoolPlace = schoolPlace +' / '+ place.city
    }
    newLine =
    '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" class="checkboxes" value="1" /> <span></span> </label> </td> <td> '+school.name+' </td> <td> <a href="mailto:'+school.email+'"> '+school.email+' </a> </td> <td> <span class="label label-sm label-'+schoolStatusInfo+'"> '+schoolStatus+' </span> </td> <td class="center"> '+schoolPlace+' </td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> Actions <i class="fa fa-angle-down"></i> </button> <ul class="dropdown-menu pull-left" role="menu"> <li> <a id="editSchoolShowButton'+school.id+'" data-toggle="modal" href="#schoolModal'+school.id+'"> <i class="icon-user"></i> Edit </a> </li> <li><a id="removeSchool'+school.id+'" class="">Remove School</a></li><li><a id="changeStatus'+school.id+'">Change Status</a></li> </ul> </div> </td> </tr>'
    $('#schoolTable').append(newLine);

    //------EDIT SCHOOL MODAL START
    newLine =
    '<div class="modal fade bs-modal-lg" id="schoolModal'+school.id+'" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">Edit ---> '+school.name+'</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6 editNameBox"'+school.id+'> <label class="control-label" for="name">Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="editName'+school.id+'" type="text" placeholder="Name"  value="'+school.name+'"/> </div> </div> <div class="col-md-6 editURLBox'+school.id+'"> <label class="control-label" for="URL">URL</label> <div class="input-group col-md-12"> <input class="form-control" id="editURL'+school.id+'" type="text" placeholder="URL" value="'+school.URL+'" /> </div> </div> </div> <div class="form-group"> <div class="col-md-6 editEmailBox'+school.id+'"> <label class="control-label" for="email">Email</label> <div class="input-group col-md-12"> <input class="form-control" id="editEmail'+school.id+'" type="email" placeholder="Email" value="'+school.email+'" /> </div> </div> <div class="col-md-6 editPhoneBox'+school.id+'"> <label class="control-label" for="phone">Phone</label> <div class="input-group col-md-12"> <input class="editPhone'+school.id+' form-control" id="editPhone'+school.id+'" type="text" value="'+school.phone+'"/> </div> </div> <div class="col-md-12 editAdressBox'+school.id+'"> <label class="control-label" for="adress">Adress</label> <div class="input-group col-md-12"></div> <input class="form-control" id="editAdress'+school.id+'" type="text" placeholder="Adress" value="'+school.adress+'" /> </div> <div class="col-md-4 editCountryBox'+school.id+'"> <label class="control-label" for="country">Country</label> <div class="input-group col-md-12"> <select class="form-control" id="editCountry'+school.id+'"> <option hidden="hidden" disabled="disabled">Country...</option> </select> </div> </div> <div class="col-md-4 editStateBox'+school.id+'"> <label class="control-label" for="state">State</label> <div class="input-group col-md-12"> <select class="form-control" id="editState'+school.id+'"> <option hidden="hidden" disabled="disabled">State...</option> </select> </div> </div> <div class="col-md-4 editCityBox'+school.id+'"> <label class="control-label" for="city">City</label> <div class="input-group col-md-12"> <select class="form-control" id="editCity'+school.id+'"> <option hidden="hidden" disabled="disabled">City...</option> </select> </div> </div> <div class="col-md-12 editDescriptionBox'+school.id+'"> <label class="control-label" for="adress">Description</label> <div class="input-group col-md-12"> <textarea class="form-control" id="editDescription'+school.id+'" type="text" placeholder="Description..." rows="4" value="">'+school.description+'</textarea> </div> </div> <div class="col-md-12"> <input class="make-switch" id="editAirportCheck'+school.id+'" type="checkbox" checked="" data-size="normal" /> <label class="control-label" for="airport" style="margin-top:20px; margin-left:10px">Airport Pickup</label> <div class="input-group col-md-12 editAirportBox'+school.id+'"><span class="input-group-addon"><i class="fa fa-usd"></i></span> <input class="form-control" id="editAirport'+school.id+'" type="number" placeholder="Airport Pickup Price ($$ USD)" value=""/> </div> </div> <div class="col-md-12"> <input class="make-switch" id="editAccommodationCheck'+school.id+'" type="checkbox" checked="" data-size="normal" /> <label class="control-label" for="accommodation" style="margin-top:20px; margin-left:10px">Accommodation</label> <div class="input-group col-md-12 editAccommodationBox'+school.id+'"><span class="input-group-addon"><i class="fa fa-usd"></i></span> <input class="form-control" id="editAccommodation'+school.id+'" type="number" placeholder="Accommodation Price ($$ USD)" value=""/> </div> </div> <div class="col-md-12"> <input class="make-switch" id="editHInsuranceCheck'+school.id+'" type="checkbox" checked="" data-size="normal" /> <label class="control-label" for="hInsurance" style="margin-top:20px; margin-left:10px">Health Insurance</label> <div class="input-group col-md-12 editHInsuranceBox'+school.id+'"><span class="input-group-addon"><i class="fa fa-usd"></i></span> <input class="form-control" id="editHInsurance'+school.id+'" type="number" placeholder="Health Insurance Price Price ($$ USD)" value="" /> </div> </div> <div class="col-md-12"> <input class="make-switch" id="editDiscountCheck'+school.id+'" type="checkbox" checked="" data-size="normal" /> <label class="control-label" for="discount" style="margin-top:20px; margin-left:10px">Discount</label> <div class="input-group col-md-12 editDiscountBox'+school.id+'"><span class="input-group-addon"><i class="fa fa-chevron-circle-right"></i></span> <input class="form-control editDiscountBox'+school.id+'" id="editDiscount'+school.id+'" type="number" placeholder="Discount (%)" value="" /> </div> </div> </div><div id="allImages"> <div class="col-md-4"><form id="editSchoolLogoBox'+school.id+'" style="width: 100%; margin-top: 50px;" class="dropzone-file-area dropzone"><h3 class="sbold">Select New Logo</h3> (Drag or Click)</form> <div class="dropzone-file-area" id="currentLogoBox'+school.id+'" style="margin-top:50px;"> <h3 class="sblod">LOGO</h3> <div id="logoBox"'+school.id+'><img src="/images/logos/'+images.logo+images.logoType+'" width="120"></div><button class="btn yellow" id="logoEditButton'+school.id+'" style="margin-right:auto; margin-left:auto; margin-top:5px; display: block;">Change</button> </div> </div><div class="col-md-8"><form id="editNewImages'+school.id+'" style="width: 100%; margin-top: 50px;" class="dropzone-file-area dropzone"><h3 class="sbold">Select New Images</h3> (Drag or Click)</form> <div class="dropzone-file-area" id="schoolImageList'+school.id+'" style="margin-top:50px;"> <h3 class="sblod">School\'s Images</h3><div style="margin-bottom:15px;"> <button class="btn green" id="addNewImages'+school.id+'">Add New Images</button> </div> <div id="allSchoolImageBox'+school.id+'"></div> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button" id="editSchoolButton'+school.id+'" data-style="zoom-in"><span class="ladda-label">Save School</span></button> </div> </div> </div> </div>'
    $('body').append(newLine);
    //------EDIT SCHOOL MODA END
    if(forCreation[school.id] != 1){
        $("#editSchoolLogoBox"+school.id).dropzone({
            maxFiles: 1,
            url: "/find/logo?schoolId="+school.id,
            acceptedFiles: "image/*",
            //autoProcessQueue: false,
            parallelUploads: 1,
            init: function() {
                //this.on("addedfile", function(files) {
                //    this.processQueue();
                //}),
                this.on("processing", function(file) {
                    this.options.url = "/find/logo?schoolId="+school.id;
                    console.log('procsesing');
                }),
                this.on("success", function(file){
                    console.log('success');
                    //this.processQueue();
                }),
                this.on("queuecomplete", function (file) {
                    console.log('queueComplete');
                    this.removeAllFiles();
                    $('#currentLogoBox'+school.id).show();
                    $('#editSchoolLogoBox'+school.id).hide();
                });
        }});
        $("#editNewImages"+school.id).dropzone({
            url: "/find/image?schoolId="+school.id,
            acceptedFiles: "image/*",
            url:'/find/images',
            //autoProcessQueue: false,
            parallelUploads: 1,
            init: function() {
                //this.on("addedfile", function(files) {
                //    this.processQueue();
                //}),
                this.on("processing", function(file) {
                    this.options.url = "/find/image?schoolId="+school.id;
                    console.log('procsesing');
                }),
                this.on("success", function(file){
                    console.log('success');
                    //this.processQueue();
                }),
                this.on("queuecomplete", function (file) {
                    console.log('queueComplete');
                    this.removeAllFiles();
                    $('#schoolImageList'+school.id).show();
                    $('#editNewImages'+school.id).hide();
                });
        }});
        forCreation[school.id] = 1;
    }
    $('#currentLogoBox'+school.id).show();
    $('#editSchoolLogoBox'+school.id).hide();
    $('#schoolImageList'+school.id).show();
    $('#editNewImages'+school.id).hide();
    
    $('#logoEditButton'+school.id).on('click', function(){
        $('#currentLogoBox'+school.id).hide();
        $('#editSchoolLogoBox'+school.id).show();
    });
    $('#addNewImages'+school.id).on('click', function(){
        $('#schoolImageList'+school.id).hide();
        $('#editNewImages'+school.id).show();
    })
    refreshSchoolImages(images, school, ()=>{});
    if(school.airport !='0'){
        $('#editAirport'+school.id).val(school.airport);
    }
    else{
        $('#editAirportCheck'+school.id).prop('checked', false);
        $('#editAirport'+school.id).prop('disabled', 'disabled');
    }
    if(school.hInsurance !='0'){
        $('#editHInsurance'+school.id).val(school.hInsurance);
    }
    else{
        $('#editHInsuranceCheck'+school.id).prop('checked', false);
        $('#editHInsurance'+school.id).prop('disabled', 'disabled');
    }
    if(school.accommodation !='0'){
        $('#editAccommodation'+school.id).val(school.accommodation);
    }
    else{
        $('#editAccommodationCheck'+school.id).prop('checked', false);
        $('#editAccommodation'+school.id).prop('disabled', 'disabled');;
    }
    if(school.discount !='0'){
        $('#editDiscount'+school.id).val(school.discount);
    }
    else{
        $('#editDiscountCheck'+school.id).prop('checked', false);
        $('#editDiscount'+school.id).prop('disabled', 'disabled');
    }
    $('#changeStatus'+school.id).on('click', function(){
        newStatus = 'false';
        if(school.status != true){
            newStatus = 'true';
        }
        $.ajax({
            url:'/find/school?id='+school.id+'&status='+newStatus,
            method:'PATCH',
            success:(data)=>{
                $('#refreshListsButton').trigger('click');
            }
        })
    })
    $('#editCountry'+school.id).on('change', function(){
        refreshEditSchoolStates(school.id);
    });
    $('#editState'+school.id).on('change', function(){
        refreshEditSchoolCitys(school.id);
    });
    $('#removeSchool'+school.id).on('click', ()=>{
        swal({
            title: school.name+" ===>Are you sure?",
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
                    url:'/school/delete?id='+school.id,
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
              }
          });
        currentSchoolId = school.id;
    });
    $('#editAirportCheck'+school.id).change(()=>{
        if($('#editAirportCheck'+school.id).prop("checked")){
            $('#editAirport'+school.id).removeAttr('disabled');
        }
        else{
            $('#editAirport'+school.id).prop('disabled', 'disabled');
        }
    });
    $('#editAccommodationCheck'+school.id).change(()=>{
        if($('#editAccommodationCheck'+school.id).prop("checked")){
            $('#editAccommodation'+school.id).removeAttr('disabled');
        }
        else{
            $('#editAccommodation'+school.id).prop('disabled', 'disabled');
        }
    });
    $('#editHInsuranceCheck'+school.id).change(()=>{
        if($('#editHInsuranceCheck'+school.id).prop("checked")){
            $('#editHInsurance'+school.id).removeAttr('disabled');
        }
        else{
            $('#editHInsurance'+school.id).prop('disabled', 'disabled');
        }
    });
    $('#editDiscountCheck'+school.id).change(()=>{
        if($('#editDiscountCheck'+school.id).prop("checked")){
            $('#editDiscount'+school.id).removeAttr('disabled');
        }
        else{
            $('#editDiscount'+school.id).prop('disabled', 'disabled');
        }
    })
    $('#editSchoolButton'+school.id).unbind().on('click', function(){
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
            var patchPlace =''
            if($('#editCountry'+school.id).val() != null){
                patchPlace = patchPlace + '&countryId='+$('#editCountry'+school.id).val();
            }
            if($('#editState'+school.id).val() != null){
                patchPlace = patchPlace + '&stateId='+$('#editState'+school.id).val();
            }
            if($('#editCity'+school.id).val() != null){
                patchPlace = patchPlace + '&cityId='+$('#editCity'+school.id).val();
            }
            $.ajax({
                url:'/find/school?id='+school.id+'&url='+$('#editURL'+school.id).val()+'&name='+$('#editName'+school.id).val()+'&email='+$('#editEmail'+school.id).val()+patchPlace+'&description='+$('#editDescription'+school.id).val()+'&adress='+$('#editAdress'+school.id).val()+'&phone='+$('.editPhone'+school.id).val()+CreateSchoolExtras,
                method:'PATCH',
                success:(data)=>{
                    l.stop();
                    $('.close').trigger('click');
                    $('#refreshListsButton').trigger('click');
                }
            })
        });
    })
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
    if($('#addCountry').text() ==''){
        $('.addCountryBox').addClass('has-error');
        l.stop();
        return false;
    }
    if($('.addPhone').val() ==''){
        $('.addPhoneBox').addClass('has-error');
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
function editSchoolCheckEmptyBoxes(id, checks, l, callback){
    $('.modal-content div').removeClass('has-error');
    if($('#editName'+id).val() ==''){
        $('.editNameBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editURL'+id).val() ==''){
        $('.editURLBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editEmail'+id).val() ==''){
        $('.editEmailBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editAdress'+id).val() ==''){
        $('.editAdressBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('#editCountry'+id).text() ==''){
        $('.editCountryBox'+id).addClass('has-error');
        l.stop();
        return false;
    }
    if($('.editPhone'+id).val() ==''){
        $('.editPhoneBox'+id).addClass('has-error');
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
        if($('#editAirport'+id).val() ==''){
            $('.editAirportBox'+id).addClass('has-error');
            l.stop();
            return false;
        }
        else{
            extras = extras + '&airport='+$('#editAirport'+id).val();
        }
    }
    if(checks[1] == 1){
        if($('#editAccommodation'+id).val() ==''){
            $('.editAccommodationBox'+id).addClass('has-error');
            l.stop();
            return false;
        }
        else{
            extras = extras + '&accommodation='+$('#editAccommodation'+id).val();
        }
    }
    if(checks[2] == 1){
        if($('#editHInsurance'+id).val() ==''){
            $('.editHInsuranceBox'+id).addClass('has-error');
            l.stop();
            return false;
        }
        else{
            extras = extras + '&hInsurance='+$('#editHInsurance'+id).val();
        }
        
    }
    if(checks[3] == 1){
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
function refreshNewSchoolCountries(){
    $('#addCountries option').remove();
    $('#addState option').remove();
    $('#addCity option').remove();
    $.ajax({
        url:'/find/country',
        method:'GET',
        success: (countries)=>{
            countries.forEach(country => {
                newElement = 
                '<option value="'+country.id+'">'+country.country+'</option>'
                $('#addCountry').append(newElement);
                if(country == countries[countries.length-1]){
                    $.ajax({
                        url:'/find/state?countryId='+$('#addCountry').val(),
                        method:'GET',
                        success: (states)=>{
                            if(states != []){
                                states.forEach(state => {
                                    newElement = 
                                    '<option value="'+state.id+'">'+state.state+'</option>'
                                    $('#addState').append(newElement);
                                    if(state == states[states.length-1]){
                                        $('#addState').removeAttr('disabled');
                                        $.ajax({
                                            url:'/find/city?stateId='+$('#addState').val(),
                                            method:'GET',
                                            success: (citys)=>{
                                                if(citys != []){
                                                    citys.forEach(city => {
                                                        newElement = 
                                                        '<option value="'+city.id+'">'+city.city+'</option>'
                                                        $('#addCity').append(newElement);
                                                        if(city == citys[citys.length-1]){
                                                            $('#addCity').removeAttr('disabled');
                                                        }
                                                    });
                                                }
                                                else{
                                                    $('#addState').attr('disabled', 'disabled');
                                                }
                                            }
                                        }).fail((data)=>{
                                            console.log('fail: '+data);
                                        });
                                    }
                                });
                            }
                            else{
                                $('#addState').attr('disabled', 'disabled');
                            }
                        }
                    }).fail((data)=>{
                        console.log('fail: '+data);
                    });
                }
            });
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function refreshEditSchoolPlace(school, place){
        $('#editCountry'+school.id+' option').remove();
        $('#editState'+school.id+' option').remove();
        $('#editCity'+school.id+' option').remove();
        var t = 1;
        const promise = new Promise((resolve,reject)=>{
            $.ajax({
                url:'/find/country',
                method:'GET',
                success: (countries)=>{
                    countries.forEach(country => {
                        newElement = 
                        '<option value="'+country.id+'">'+country.country+'</option>'
                        $('#editCountry'+school.id+'').append(newElement);
                        if(country == countries[countries.length-1]){
                            resolve(school, place);
                        }
                    });
                }
            }).fail((data)=>{
                console.log('fail: '+data);
            });
        }).then(()=>{
            $('#editCity'+school.id+' option').remove();
            $('#editCountry'+school.id).val(place.countryId);
            $.ajax({
                url:'/find/state?countryId='+place.countryId,
                method:'GET',
                success: (states)=>{
                    if(states.length != 0){
                        states.forEach(state => {
                        newElement = 
                        '<option value="'+state.id+'">'+state.state+'</option>'
                        $('#editState'+school.id+'').append(newElement);
                        if(state == states[states.length-1]){
                            return ('then1 completed');
                        }
                    });
                    }
                    else{
                        $('.editStateBox'+school.id).hide();
                        $.ajax({
                            url:'/find/city?countryId='+place.countryId,
                            method:'GET',
                            success: (citys)=>{
                                citys.forEach(city => {
                                    newElement = 
                                    '<option value="'+city.id+'">'+city.city+'</option>'
                                    $('#editCity'+school.id+'').append(newElement);
                                });
                                $('#editCity'+school.id).val(place.cityId);
                            }
                        })
                    }
                }
            });
        }).then(()=>{
            if(place.state){
                $('#editState'+school.id).val(place.stateId);
                        $.ajax({
                            url:'/find/city?stateId='+place.stateId,
                            method:'GET',
                            success: (citys)=>{
                                citys.forEach(city => {
                                    newElement = 
                                    '<option value="'+city.id+'">'+city.city+'</option>'
                                    $('#editCity'+school.id+'').append(newElement);
                                });
                                $('#editCity'+school.id).val(place.cityId);
                            }
                        })
            }
        })

}
function refreshNewSchoolStates(){
    $('#addState option').remove();
    $('#addCity').attr('disabled', 'disabled');
    $('#addCity option').remove();
    $.ajax({
        url:'/find/state?countryId='+$('#addCountry').val(),
        method:'GET',
        success: (states)=>{
            if(states.length !=0){
                states.forEach(state => {
                    newElement = 
                    '<option value="'+state.id+'">'+state.state+'</option>'
                    $('#addState').append(newElement);
                });
                $('#addState').removeAttr('disabled');
                $('.addStateBox').show();
                $('#addState').trigger('change');
            }
            else{
                $('.addStateBox').hide();
                $.ajax({
                    url:'/find/city?countryId='+$('#addCountry').val(),
                    method:'GET',
                    success: (citys)=>{
                        if(citys.length !=0){
                            citys.forEach(city => {
                                newElement = 
                                '<option value="'+city.id+'">'+city.city+'</option>'
                                $('#addCity').append(newElement);
                            });
                            $('#addCity').removeAttr('disabled');
                            $('.addCityBox').show();
                        }
                        else{
                            $('.addCityBox').hide();
                        }
                    }
                })
            }
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function refreshEditSchoolStates(id){
    $('#editState'+id+' option').remove();
    $('#editCity'+id).attr('disabled', 'disabled');
    $('#editCity'+id+' option').remove();
    $.ajax({
        url:'/find/state?countryId='+$('#editCountry'+id).val(),
        method:'GET',
        success: (states)=>{
            if(states.length != 0){
                $('.editStateBox'+id+'').show();
                states.forEach(state => {
                    newElement = 
                    '<option value="'+state.id+'">'+state.state+'</option>'
                    $('#editState'+id).append(newElement);
                    $('#editState'+id).removeAttr('disabled');
                });
                $('#editState'+id+'').trigger('change');
            }
            else{
                $('.editStateBox'+id+'').hide();
                $('#editState'+id).attr('disabled', 'disabled');
                $.ajax({
                    url:'/find/city?countryId='+$('#editCountry'+id).val(),
                    method:'GET',
                    success: (citys)=>{
                        if(citys.length !=0){
                            citys.forEach(city => {
                                newElement = 
                                '<option value="'+city.id+'">'+city.city+'</option>'
                                $('#editCity'+id).append(newElement);
                            });
                            $('#editCity'+id).removeAttr('disabled');
                            $('.editCityBox'+id).show();
                        }
                        else{
                            $('.editCityBox'+id).hide();
                        }
                    }
                })
            }
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function refreshNewSchoolCitys(){
    $('#addCity option').remove();
    $.ajax({
        url:'/find/city?stateId='+$('#addState').val(),
        method:'GET',
        success: (citys)=>{
            citys.forEach(city => {
                newElement = 
                '<option value="'+city.id+'">'+city.city+'</option>'
                $('#addCity').append(newElement);
            });
            $('#addCity').removeAttr('disabled');
            $('.addCityBox').show();
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function refreshEditSchoolCitys(id){
    $('#editCity'+id+' option').remove();
    $.ajax({
        url:'/find/city?stateId='+$('#editState'+id).val(),
        method:'GET',
        success: (citys)=>{
            if(citys != []){
                citys.forEach(city => {
                    newElement = 
                    '<option value="'+city.id+'">'+city.city+'</option>'
                    $('#editCity'+id).append(newElement);
                    $('#editCity'+id).removeAttr('disabled');
                });
            }
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function clearNewSchool(){
    $('#addName').val('');
    $('#addURL').val('');
    $('#addEmail').val('');
    $('.addPhone').val('');
    $('#addAdress').val('');
    $('#addDescription').val('');
    $('#addAirport').val('');
    $('#addAccommodation').val('');
    $('#addHInsurance').val('');
    $('#addDiscount').val('');
    if($('.bootstrap-switch-id-airportCheck').hasClass('bootstrap-switch-off')){
        $('#airportCheck').trigger('click');
    }
    if($('.bootstrap-switch-id-accommodationCheck').hasClass('bootstrap-switch-off')){
        $('#accommodationCheck').trigger('click');
    }
    if($('.bootstrap-switch-id-hInsuranceCheck').hasClass('bootstrap-switch-off')){
        $('#hInsuranceCheck').trigger('click');
    }
    if($('.bootstrap-switch-id-discountCheck').hasClass('bootstrap-switch-off')){
        $('#discountCheck').trigger('click');
    }
}

function refreshSchoolImages(images, school, callback){
    console.log('images:', images);
    $('#allSchoolImageBox'+school.id).empty();
    images.schoolImage.forEach(currentImage => {
        newLine =
        '<div id="schoolImageDiv'+school.id+'-'+currentImage.id+'" style="margin-right: 10px; margin-left: 10px; display:inline-block"> <img src="/images/schoolImages/'+currentImage.name+'" width="120"><button class="btn red" id="removeImage'+school.id+'-'+currentImage.id+'" style="margin-right:auto; margin-left:auto; margin-top:5px; display: block;">Remove</button></div>'
        $('#allSchoolImageBox'+school.id).append(newLine);
        $('#removeImage'+school.id+'-'+currentImage.id).on('click', function(){
            console.log('school.id = '+school.id);
            console.log('image.id = ', currentImage.id);
            $('#schoolImageDiv'+school.id+'-'+currentImage.id).attr('style', 'opacity: 0.3; cursor:none;');
            $('#schoolImageDiv'+school.id+'-'+currentImage.id).attr('disabled', 'disabled');
            $.ajax({
                url:'/image/delete?id='+currentImage.id+'&schoolId='+school.id+'&type='+currentImage.type,
                method:'DELETE',
                success: (data)=>{
                    $('#schoolImageDiv'+school.id+'-'+currentImage.id).remove();
                }
            })
        });
        if(currentImage == images.schoolImage[images.schoolImage.length-1]){
            $('#allSchoolImageBox'+school.id).show();
            callback();
        }
    });
}