$(document).ready(function(){

    $('#showSchools').on('click', function(){
        closeAllTabs();
        openSchoolsTab();
    });
    $('#showCountries').on('click', function(){
        $('#content').css('pointer-events', 'none');
        $('#content').css('opacity', '0.4');
        $.ajax({
            url:'/country/all',
            method: 'GET',
            success: (data)=>{
                closeAllTabs();
                $('#content').css('pointer-events', 'auto');
                $('#content').css('opacity', '1');
                openCountriesTab();
                $('#newCountryButton').on('click', function(){
                    $('#sucessInfoChangeCountryName').remove();
                    if($('#newCountryName').val() != ''){
                        $.ajax({
                            url:'/country/new?country='+$('#newCountryName').val(),
                            method: 'GET',
                            //data: {Slanguage, Scountry, Sduration, Saccommodation},
                            success: (data)=>{
                                $('#newCountryBox').append('<div class="text-success info" id="sucessInfoChangeCountryName">Kayıt Oluşturuldu.</div>');
                                refreshCountries();
                                $('#newCountryName').val('');
                            }
                        }).fail((data)=>{
                            console.log('fail: '+data);
                        });
                    }
                    else{
                        $('#newCountryBox').append('<div class="text-danger info" id="sucessInfoChangeCountryName">Alan Boş.</div>');
                    }
                });
                $('#countryListSelect').on('change', function(){
                    $('#countryBox').remove();
                    newElement =
                    '<div id="countryBox"><div class="mb-5 mt-1 border p-4" id="reNameCountryBox"><input class="mr-3" id="reNameCountry" type="text" /><button class="btn btn-secondary" id="reNameCountrySave">Yeniden Adlandir</button></div></div>'
                    selectedCountry = document.getElementById('countryListSelect').selectedIndex;
                    selectedCountry = $('#countryListSelect option').eq(selectedCountry).val();
                    console.log(selectedCountry);
                    $('#deleteCountry').on('click', ()=>{
                        if($('#CountryListSelect').val() != ''){
                            contentDisable();
                            deleteCountry(selectedCountry, ()=>{
                                $('#sucessInfoChangeCountryName').remove();
                                $('#newCountryBox').append('<div class="text-success info" id="sucessInfoChangeCountryName">Country Silindi...</div>');
                                $('#reNameCountry').val('');
                                contentEnable();
                                refreshCountries();
                            });
                        }
                        else{
                            $('#sucessInfoChangeCountryName').remove();
                            $('#reNameCountry').val('');
                            $('#newCountryBox').append('<div class="text-danger info" id="sucessInfoChangeStateName">Alan Bos</div>');
                            refreshCountry();
                        }
                    });
                    findCountryById(selectedCountry, (country)=>{
                        $('#deleteCountry').show();
                        $('#editCountryBox').append(newElement);
                        newElement = 
                        '<div id="stateEditBox" class="mt-4 ml-auto mr-2 border p-4 d-inline-block text-center"><h3 class="mx-auto">State</h3><div id="newNameStateBox" class="d-inline-block"><input class="" id="newNameState" type="text" /> <button class="btn btn-primary mx-auto d-block mt-1" id="newStateButton">Yeni Kayit</button> </div> <div class="mt-4" id="editStateBox"> <div class="d-inline-block"> <select class="d-block form-control" id="stateListSelect"> <option hidden disabled="disabled" selected>Select State</option> </select> <input class="d-block form-control mb-3 mt-1" disabled id="reNameState" type="text" /> <button id="reNameStateSave" class="btn btn-secondary mx-auto" disabled>Yeniden Adlandir</button> <button class="btn btn-danger mx-auto" disabled id="deleteStateButton">Sil</button> </div> </div> </div>';
                        $('#countryBox').append(newElement);
                        $('#reNameCountry').val(country);
                        refreshStates(selectedCountry, ()=>{});
                        var selectedState;
                        var selectedCity;
                        $('#stateListSelect').on('change', function(){
                            selectedState = document.getElementById('stateListSelect').selectedIndex;
                            selectedState = $('#stateListSelect option').eq(selectedState).val();
                            console.log(selectedState);
                            findStateById(selectedState, (state)=>{
                                $('#reNameState').removeAttr('disabled');
                                $('#reNameStateSave').removeAttr('disabled');
                                $('#deleteStateButton').removeAttr('disabled');
                                $('#reNameState').val(state);
                                $('#cityEditBox').remove();
                                newElement = 
                                '<div id="cityEditBox" class="mt-4 ml-2 mr-auto border p-4 d-inline-block text-center"><h3 class="mx-auto">City</h3> <div id="newNameCityBox" class="d-inline-block"><input class="" id="newNameCity" type="text" /> <button class="btn btn-primary mx-auto d-block mt-1" id="newCityButton">Yeni Kayit</button> </div> <div class="mt-4" id="editCityBox"> <div class="d-inline-block"> <select class="d-block form-control" id="cityListSelect"> <option hidden disabled="disabled" selected>Select City</option> </select> <input class="d-block form-control mb-3 mt-1" disabled id="reNameCity" type="text" /> <button id="reNameCitySave" class="btn btn-secondary mx-auto" disabled>Yeniden Adlandir</button> <button class="btn btn-danger mx-auto" disabled id="deleteCityButton">Sil</button> </div> </div> </div>';
                                $('#countryBox').append(newElement);
                                refreshCitys(selectedState, ()=>{});
                                $('#newCityButton').on('click', function(){
                                    contentDisable();
                                    $('#newNameCityInfo').remove();
                                    if($('#newNameCity').val() != ''){
                                        $.ajax({
                                            url:'/add/city?name='+$('#newNameCity').val()+'&stateId='+selectedState,
                                            method: 'PUT',
                                            //data: {Slanguage, Scountry, Sduration, Saccommodation},
                                            success: (data)=>{
                                                $('#newNameCityBox').append('<div class="text-success" id="newNameCityInfo">Kayıt Oluşturuldu.</div>');
                                                //refreshCountries();
                                                $('#newNameCity').val('');
                                                refreshCitys(selectedState, ()=>{});
                                            }
                                        }).fail((data)=>{
                                            console.log('fail: '+data);
                                        });
                                    }
                                    else{
                                        contentEnable();
                                        $('#newNameCityBox').append('<div class="text-danger" id="newNameCityInfo">Alan Boş.</div>');
                                    }
                                });
                                $('#cityListSelect').on('change', function(){
                                    selectedCity = document.getElementById('cityListSelect').selectedIndex;
                                    selectedCity = $('#cityListSelect option').eq(selectedCity).val();
                                    console.log(selectedCity);
                                    findCityById(selectedCity, (city)=>{
                                        $('#reNameCity').removeAttr('disabled');
                                        $('#reNameCitySave').removeAttr('disabled');
                                        $('#deleteCityButton').removeAttr('disabled');
                                        $('#reNameCity').val(city);
                                    })
                                });
                                $('#reNameCitySave').on('click', ()=>{
                                    $('#sucessInfoChangeCityName').remove();
                                    reNameCityName(selectedCity, $('#reNameCity').val(), ()=>{
                                        if($('#reNameCity').val() != ''){
                                            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'+ selectedCity, $('#reNameCity').val())
                                            $('#editCityBox').append('<div class="text-success info" id="sucessInfoChangeCityName">Isim Degistirildi...</div>');
                                            $('#reNameCity').val('');
                                            refreshCitys(selectedState, ()=>{});
                                        }
                                        else{
                                            $('#sucessInfoChangeCityName').remove();
                                            $('#editCityBox').append('<div class="text-danger info" id="sucessInfoChangeCityName">Alan Bos</div>');
                                            refreshCitys(selectedState, ()=>{});
                                        }
                                    });
                                });
                                $('#deleteCityButton').on('click', ()=>{
                                    $('#sucessInfoChangeCityName').remove();
                                    if($('#cityListSelect').val() != ''){
                                        contentDisable();
                                        console.log('here!!!');
                                        deleteCity(selectedCity, ()=>{
                                            $('#editCityBox').append('<div class="text-success info" id="sucessInfoChangeCityName">Sehir Silindi...</div>');
                                            $('#reNameCity').val('');
                                            contentEnable();
                                            refreshCitys(selectedState, ()=>{});
                                        });
                                    }
                                    else{
                                        $('#sucessInfoChangeCityName').remove();
                                        $('#reNameCity').val('');
                                        $('#editCityBox').append('<div class="text-danger info" id="sucessInfoChangeCityName">Alan Bos</div>');
                                        refreshCitys(selectedState, ()=>{});
                                    }
                                });
                            })
                        });
                        $('#reNameCountrySave').on('click', ()=>{
                            reNameCountryName(selectedCountry, $('#reNameCountry').val(), ()=>{
                                $('#sucessInfoChangeCountryName').remove();
                                $('#reNameCountryBox').append('<div class="text-success info" id="sucessInfoChangeCountryName">Isim Degistirildi...</div>');
                                $('#reNameCountry').val('');
                                refreshCountries();
                            });
                        });
                        $('#newStateButton').on('click', function(){
                            contentDisable();
                            $('#newNameStateInfo').remove();
                            if($('#newNameState').val() != ''){
                                $.ajax({
                                    url:'/add/state?name='+$('#newNameState').val()+'&countryId='+selectedCountry,
                                    method: 'PUT',
                                    //data: {Slanguage, Scountry, Sduration, Saccommodation},
                                    success: (data)=>{
                                        $('#newNameStateBox').append('<div class="text-success" id="newNameStateInfo">Kayıt Oluşturuldu.</div>');
                                        //refreshCountries();
                                        $('#newNameState').val('');
                                        refreshStates(selectedCountry, ()=>{});
                                    }
                                }).fail((data)=>{
                                    console.log('fail: '+data);
                                });
                            }
                            else{
                                contentEnable();
                                $('#newNameStateBox').append('<div class="text-danger" id="newNameStateInfo">Alan Boş.</div>');
                            }
                        });
                        $('#reNameStateSave').on('click', ()=>{
                            console.log('here??');
                            reNameStateName(selectedState, $('#reNameState').val(), ()=>{
                                $('#sucessInfoChangeStateName').remove();
                                $('#editStateBox').append('<div class="text-success info" id="sucessInfoChangeStateName">Isim Degistirildi...</div>');
                                $('#reNameState').val('');
                                refreshStates(selectedCountry, ()=>{});
                            });
                        });
                        $('#deleteStateButton').on('click', ()=>{
                            $('#sucessInfoChangeStateName').remove();
                            if($('#stateListSelect').val() != ''){
                                contentDisable();
                                deleteState(selectedState, ()=>{
                                    $('#editStateBox').append('<div class="text-success info" id="sucessInfoChangeStateName">State Silindi...</div>');
                                    $('#reNameState').val('');
                                    contentEnable();
                                    refreshStates(selectedCountry, ()=>{});
                                });
                            }
                            else{
                                $('#sucessInfoChangeStateName').remove();
                                $('#reNameState').val('');
                                $('#editStateBox').append('<div class="text-danger info" id="sucessInfoChangeStateName">Alan Bos</div>');
                                refreshStates(selectedState, ()=>{});
                            }
                        })
                    });
                });
            }
        }).fail((data)=>{
            console.log('fail: '+data);
        });
        closeSchoolsTab();
    });
    $('#showLanguages').on('click', function(){
        closeAllTabs();
        openLanguagesTab();
    });
});




function closeAllTabs(){
    closeCountriesTab();
    closeSchoolsTab();
    closeLanguagesTab();
}

function callback(func1, func2){
    func1();
    func2();
}


/////////////////SCHOOL PAGE
function openSchoolsTab(){
    newContent =
    '<div id="schoolsTabDiv"><button type="button" class="btn btn-warning btn-lg mb-3" data-toggle="modal" data-target="#createSchoolModal"> Yeni Okul Ekle </button> <div class="modal fade" id="createSchoolModal" tabindex="-1" role="dialog" aria-labelledby="createSchoolHeader" aria-hidden="true"> <div class="modal-dialog modal-lg " role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="createSchoolHeader">Yeni Okul Ekle</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body"> <form id="createSchoolForm" action="" method="POST" enctype="multipart/form-data"> <div> <span class="font-weight-bold" style="width:250px;"">School Name:</span><input class="form-control d-inline-block" type="text" id="createSchoolName" required/> </div> <div> <span class="font-weight-bold" style="width:250px;"">HTTP-Adress:</span><input class="form-control d-inline-block" type="text" id="createSchoolHttp" required/> </div><div> <span class="font-weight-bold" style="width:250px;"">School Description:</span><input class="form-control d-inline-block" type="text" id="createSchoolDescription" required/> </div> <div> <span class="font-weight-bold" style="width:250px;"">Language:</span><select class="form-control d-inline-block" id="createSchoolLanguage" /></select> </div> <div> <span class="font-weight-bold" style="width:250px;"">Country:</span><select class="form-control d-inline-block" id="createSchoolCountry" /></select> </div> <div> <span class="font-weight-bold" style="width:250px;"">State:</span><select class="form-control d-inline-block" id="createSchoolState" /></select> </div> <div> <span class="font-weight-bold" style="width:250px;"">City:</span><select class="form-control d-inline-block" id="createSchoolCity" /></select> </div><div> <span class="font-weight-bold" style="width:250px;"">Adress:</span><input type="text" class="form-control d-inline-block" id="createSchoolAdress" required/></input> </div><div> <span class="font-weight-bold" style="width:250px;"">Phone:</span><input type="text" class="form-control d-inline-block" id="createSchoolPhone" required/></input> </div> <div> <span class="font-weight-bold" style="width:250px;"">Accommodation:</span><select class="form-control d-inline-block" id="createSchoolAccommodation" /></select> </div> <div> <span class="font-weight-bold" style="width:250px;"">Airport Pickup:</span><select class="form-control d-inline-block" id="createSchoolAirport" /></select> </div> <div> <span class="font-weight-bold" style="width:250px;"">Health Insurance:</span><select class="form-control d-inline-block" id="createSchoolhInsurance" /> </select> </div><div class="form-group"> <label for="example-input-file"> </label> <input type="file" name="multi-files" multiple id="input-multi-files" class="form-control-file border"/></div></form> <div class="preview-images"></div>  </div> <button id="newImageButton" style="width:50px;" class="btn btn-secondary mx-3 mb-3 d-inline-block">+</button> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" id="createSchoolSave">Save changes</button> </div> </div> </div> </div><table class="table table-striped" id="schoolsTable"> <thead> <tr style="font-size:0.9rem;"> <th> <input id="checkAllSchools" type="checkbox" /> </th> <th>ID</th> <th>School Name</th> <th>Place</th> <th>Acco.</th> <th>Airport</th> <th>H.Ins.</th> <th>-</th> </tr> </thead> </table></div>'
    $('#content').append(newContent);
    $('#createSchoolAirport').append('<option value="0">No</option> <option value="1">Yes</option>');
    $('#createSchoolAccommodation').append('<option value="0">No</option> <option value="1">Yes</option>');
    $('#createSchoolhInsurance').append('<option value="0">No</option> <option value="1">Yes</option>');
    $('#createSchoolDiscount').append('<option value="0">No</option> <option value="1">Yes</option>');
    refreshSchoolList();

    let imagesPreview = function(input, placeToInsertImagePreview) {
        if (input.files) {
          let filesAmount = input.files.length;
          for (i = 0; i < filesAmount; i++) {
            let reader = new FileReader();
            reader.onload = function(event) {
              $($.parseHTML("<img style='width:200px;'>"))
                .attr("src", event.target.result)
                .appendTo(placeToInsertImagePreview);
            };
            reader.readAsDataURL(input.files[i]);
          }
        }
    };
    $("#input-multi-files").on("change", function() {
        imagesPreview(this, "div.preview-images");
    });
    $('#createSchoolAirport').on('change', function(){
        if($('#createSchoolAirport').val() == '1'){
            $('<div id="createSchoolAirportPriceBox"><span class="text-lg font-weight-bold mr-4">Price($)</span><input type="Number" id="createSchoolAirportPrice" class="d-inline-block form-control mt-1 mb-2" style="width:auto;" required></div>').insertAfter($('#createSchoolAirport'));
        }
        else{
            $('#createSchoolAirportPriceBox').remove();
        }
    });
    $('#createSchoolhInsurance').on('change', function(){
        if($('#createSchoolhInsurance').val() == '1'){
            $('<div id="createSchoolhInsurancePriceBox"><span class="text-lg font-weight-bold mr-4">Price($)</span><input type="Number" id="createSchoolhInsurancePrice" class="d-inline-block form-control mt-1 mb-2" style="width:auto; " required></div>').insertAfter($('#createSchoolhInsurance'));
        }
        else{
            $('#createSchoolhInsurancePriceBox').remove();
        }
    });
    $('#createSchoolAccommodation').on('change', function(){
        if($('#createSchoolAccommodation').val() == '1'){
            $('<div id="createSchoolAccommodationPriceBox"><span class="text-lg font-weight-bold mr-4">Price($)</span><input type="Number" id="createSchoolAccommodationPrice" class="d-inline-block form-control mt-1 mb-2" style="width:auto;" required></div>').insertAfter($('#createSchoolAccommodation'));
        }
        else{
            $('#createSchoolAccommodationPriceBox').remove();
        }
    });
    $('#createSchoolSave').on('click', function(){
        const createSchoolName = $('#createSchoolName').val();
        const createSchoolHttp = $('#createSchoolHttp').val();
        const createSchoolDescription = $('#createSchoolDescription').val();
        const createSchoolLanguage = $('#createSchoolLanguage').val();
        const createSchoolCountry = $('#createSchoolCountry').val();
        const createSchoolState = $('#createSchoolState').val();
        const createSchoolCity = $('#createSchoolCity').val();
        const createSchoolAdress = $('#createSchoolAdress').val();
        const createSchoolPhone = $('#createSchoolPhone').val();
        const createSchoolAccommodation = $('#createSchoolAccommodation').val();
        const createSchoolAccommodationPrice = $('#createSchoolAccommodationPrice').val();
        const createSchoolAirport = $('#createSchoolAirport').val();
        const createSchoolAirportPrice = $('#createSchoolAirportPrice').val();
        const createSchoolhInsurance = $('#createSchoolhInsurance').val();
        const createSchoolhInsurancePrice = $('#createSchoolhInsurancePrice').val();
        $('#createSchoolForm').attr('action', '/panel/multiple-upload?name='+createSchoolName+'&http='+createSchoolHttp+'&description='+createSchoolDescription+'&language='+createSchoolLanguage+'&country='+createSchoolCountry+'&state='+createSchoolState+'&city='+createSchoolCity+'&adress='+createSchoolAdress+'&phone='+createSchoolPhone+'&accommodation='+createSchoolAccommodation+'&accommodationPrice='+createSchoolAccommodationPrice+'&airport='+createSchoolAirport+'&airportPrice='+createSchoolAirportPrice+'&hInsurance='+createSchoolhInsurance+'&hInsurancePrice='+createSchoolhInsurancePrice);
        $('#createSchoolForm').submit();
    })
    findCountryAll((countries)=>{
        findStateAll(countries[0].id, (states)=>{
            for(i=0;i<states.length;i++){
                $('#createSchoolState').append('<option value="'+states[i].id+'">'+states[i].state+'</option>');
            }
            findCityAll(states[0].id, (cities)=>{
                for(i=0;i<cities.length;i++){
                    $('#createSchoolCity').append('<option value="'+cities[i].id+'">'+cities[i].city+'</option>');
                }
            })
        })
        for(i=0;i<countries.length;i++){
            $('#createSchoolCountry').append('<option value="'+countries[i].id+'">'+countries[i].country+'</option>');
        }
    });
    findLanguageAll((languages)=>{
        for(i=0;i<languages.length;i++){
            $('#createSchoolLanguage').append('<option value="'+languages[i].id+'">'+languages[i].language+'</option>');
        }
    })
    contentEnable();


}
function closeSchoolsTab(){
    $('#schoolsTabDiv').remove();
}
function addSchoolToSchoolList(school){
    newLine =
    '<tr style="font-size:0.9rem;" class="schoolTr"> <td class="text-center" style="width:15px;"> <input id="checkAllSchools" type="checkbox" /> </td> <td class="text-center" style="width:35px; overflow: hidden;">'+school.schoolId+'</td> <td>'+school.name+'</td> <td>'+school.country+' '+school.state+' '+school.city+'</td>  <td>'+school.accommodationPrice+'</td> <td>'+school.airportPrice+'</td> <td>'+school.hInsurancePrice+'</td> <td style="width:150px;"> <button value="'+school.schoolId+'" type="button" class="btn btn-primary btn-sm py-0 px-1" id="schoolDetailsButton'+school.schoolId+'" style="font-size:0.8rem; margin-right: 10px; " data-toggle="modal" data-target="#EditSchoolModal'+school.schoolId+'" value="'+school.schoolId+'"> Edit </button> <div class="modal fade" id="EditSchoolModal'+school.schoolId+'" tabindex="-1" role="dialog" aria-labelledby="EditSchoolHeader'+school.schoolId+'" aria-hidden="true"> <div class="modal-dialog modal-lg " role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="EditSchoolHeader'+school.schoolId+'">'+school.name+'</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body"> <form id="editSchoolForm'+school.schoolId+'" action="" method="POST" enctype="multipart/form-data"> <div> <span class="font-weight-bold" style="width:250px;">School Name:</span><input class=" form-control d-inline-block" type="text" id="editSchoolName'+school.schoolId+'" value="'+school.name+'" required /> </div> <div> <span class="font-weight-bold" style="width:250px;">HTTP-Adress:</span><input class=" form-control d-inline-block" type="text" id="editSchoolHttp'+school.schoolId+'" value="'+school.schoolHttp+'" required /> </div> <div> <span class="font-weight-bold" style="width:250px;">School Description:</span><input class=" form-control d-inline-block" type="text" id="editSchoolDescription'+school.schoolId+'" value="'+school.description+'" required /> </div> <div> <span class="font-weight-bold" style="width:250px;">Language:</span><select class=" form-control d-inline-block" id="editSchoolLanguage'+school.schoolId+'" /></select> </div> <div> <span class="font-weight-bold" style="width:250px;">Country:</span><select class=" form-control d-inline-block" id="editSchoolCountry'+school.schoolId+'" /></select> </div> <div> <span class="font-weight-bold" style="width:250px;">State:</span><select class=" form-control d-inline-block" id="editSchoolState'+school.schoolId+'" /></select> </div> <div> <span class="font-weight-bold" style="width:250px;">City:</span><select class=" form-control d-inline-block" id="editSchoolCity'+school.schoolId+'" /></select> </div> <div> <span class="font-weight-bold" style="width:250px;">Adress:</span><input type=" text" class="form-control d-inline-block" id="editSchoolAdress'+school.schoolId+'" value="'+school.adress+'" required /></input> </div> <div> <span class="font-weight-bold" style="width:250px;">Phone:</span><input type=" text" class="form-control d-inline-block" id="editSchoolPhone'+school.schoolId+'" value="'+school.phone+'" required /></input> </div> <div> <span class="font-weight-bold" style="width:250px;">Accommodation:</span><select class=" form-control d-inline-block" id="editSchoolAccommodation'+school.schoolId+'" /></select> </div> <div> <span class="font-weight-bold" style="width:250px;">Airport Pickup:</span><select class=" form-control d-inline-block" id="editSchoolAirport'+school.schoolId+'" /></select> </div> <div> <span class="font-weight-bold" style="width:250px;">Health Insurance:</span><select class=" form-control d-inline-block" id="editSchoolhInsurance'+school.schoolId+'" /> </select> </div> <div class="form-group"> <label for="example-input-file"> </label> <input type="file" name="multi-files" multiple id="input-multi-files'+school.schoolId+'" class="form-control-file border" /></div> </form> <div class="preview-images"></div> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" id="createSchoolSave">Save changes</button> </div> </div> </div> </div><button class="btn btn-danger btn-sm py-0 px-1 schoolDeleteButton" id="" value="'+school.schoolId+' style="font-size:0.8rem;"> Delete</button> </td> </tr>'
    $('#schoolsTable').append(newLine);
    $('#editSchoolAirport'+school.schoolId).append('<option value="0">No</option> <option value="1">Yes</option>');
    $('#editSchoolAccommodation'+school.schoolId).append('<option value="0">No</option> <option value="1">Yes</option>');
    $('#editSchoolhInsurance'+school.schoolId).append('<option value="0">No</option> <option value="1">Yes</option>');
    $('#schoolDetailsButton'+school.schoolId).on('click', ()=>{
        if(school.accommodation == '1'){
            $('#editSchoolAccommodation'+school.schoolId).val(1);
            $('<div id="editSchoolAccommodationPriceBox"><span class="text-lg font-weight-bold mr-4">Price($)</span><input type="Number" id="editSchoolAccommodationPrice'+school.schoolId+'" class="d-inline-block form-control mt-1 mb-2" style="width:auto;" required></div>').insertAfter($('#editSchoolAccommodation'+school.schoolId));
            $('#editSchoolAccommodationPrice'+school.schoolId).val(school.accommodationPrice);
        }
        if(school.airport == '1'){
            $('#editSchoolAirport'+school.schoolId).val(1);
            $('<div id="editSchoolAirportPriceBox"><span class="text-lg font-weight-bold mr-4">Price($)</span><input type="Number" id="editSchoolAirportPrice'+school.schoolId+'" class="d-inline-block form-control mt-1 mb-2" style="width:auto;" required></div>').insertAfter($('#editSchoolAirport'+school.schoolId));
            $('#editSchoolAirportPrice'+school.schoolId).val(school.airportPrice);
        }
        if(school.hInsurance == '1'){
            $('#editSchoolhInsurance'+school.schoolId).val(1);
            $('<div id="editSchoolhInsurancePriceBox"><span class="text-lg font-weight-bold mr-4">Price($)</span><input type="Number" id="editSchoolhInsurancePrice'+school.schoolId+'" class="d-inline-block form-control mt-1 mb-2" style="width:auto;" required></div>').insertAfter($('#editSchoolhInsurance'+school.schoolId));
            $('#editSchoolhInsurancePrice'+school.schoolId).val(school.hInsurancePrice);
        }
    });
}
function refreshSchoolList(){
    var Schools = [];
    contentDisable();
        $.ajax({
            url:'/course/all',
            method: 'GET',
            success: (school)=>{
                contentEnable();
                clearSchoolList();
                Schools = school;
                Schools.forEach(school => {
                    addSchoolToSchoolList(school);
                });
                contentEnable();
            }
        })
}
function clearSchoolList(){
    $('.schoolTr').remove();
}
function contentDisable(){
    $('#content').css('pointer-events', 'none');
    $('#content').css('opacity', '0.4');
}
function contentEnable(){
    $('#content').css('pointer-events', 'auto');
    $('#content').css('opacity', '1');
}

/////////////////COUNTRY PAGE
function openCountriesTab(){
    newContent = 
    '<div id="countriesTab"><div class="my-5" id="newCountryBox"> <input class="mr-5" id="newCountryName" type="text" /> <button class="btn btn-primary btn" id="newCountryButton">Yeni Kayit</button> </div> <div id="countrListSelectBox"> <select class="form-control d-inline-block w-25" id="countryListSelect">  </select><button class="btn btn-danger mx-4" id="deleteCountry">Kaydi Sil</button></div> <div id="editCountryBox" class="pt-5"></div></div>';
    $('#content').append(newContent);
    $('#deleteCountry').hide();
    refreshCountries();
}
function closeCountriesTab(){
    $('#countriesTab').remove();
}

function refreshCountries(){
    $('#content').css('pointer-events', 'none');
    $('#content').css('opacity', '0.4');
    $.ajax({
        url:'/country/all',
        method: 'GET',
        success: (data)=>{
            $('#countryBox').remove();
            $('#content').css('pointer-events', 'auto');
            $('#content').css('opacity', '1');
            $('#countryListSelect option').remove();
            var i = 0;
            console.log(data);
            $('#countryListSelect').append('<option value="" hidden disable>Select Country</option>');
            for (i=0;i<data.length;i++){
                $('#countryListSelect').append('<option value="'+data[i].id+'">'+data[i].country+'</option>');
            }
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function refreshStates(countryId,  callback){
    $.ajax({
        url:'/state/find?countryId='+countryId,
        method: 'GET',
        success: (data)=>{
            $('#reNameState').val('');
            $('#reNameState').attr('disabled', 'disabled');
            $('#reNameStateSave').attr('disabled', 'disabled');
            $('#deleteStateButton').attr('disabled', 'disabled');
            $('#content').css('pointer-events', 'auto');
            $('#content').css('opacity', '1');
            $('#stateListSelect option').remove();
            var i = 0;
            console.log(data);
            $('#stateListSelect').append('<option value="" hidden disable>Select State</option>');
            for (i=0;i<data.length;i++){
                $('#stateListSelect').append('<option value="'+data[i].id+'">'+data[i].state+'</option>');
            }
            $('#cityEditBox').remove();
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}

function refreshCitys(stateId, callback){
    $.ajax({
        url:'/city/find?stateId='+stateId,
        method: 'GET',
        success: (data)=>{
            $('#reNameCity').val('');
            $('#reNameCity').attr('disabled', 'disabled');
            $('#reNameCitySave').attr('disabled', 'disabled');
            $('#deleteCityButton').attr('disabled', 'disabled');
            $('#content').css('pointer-events', 'auto');
            $('#content').css('opacity', '1');
            $('#cityListSelect option').remove();
            var i = 0;
            console.log('data:'+data);
            console.log('stateId:'+stateId);
            $('#cityListSelect').append('<option value="" hidden disable>Select State</option>');
            for (i=0;i<data.length;i++){
                $('#cityListSelect').append('<option value="'+data[i].id+'">'+data[i].city+'</option>');
            }
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function findCountryById(id, callback){
    $.ajax({
        url:'/country/id?id='+id,
        method: 'GET',
        success: (data)=>{
            callback(data.country);
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function findStateById(id, callback){
    $.ajax({
        url:'/state/id?id='+id,
        method: 'GET',
        success: (data)=>{
            callback(data.state);
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function findCityById(id, callback){
    $.ajax({
        url:'/city/id?id='+id,
        method: 'GET',
        success: (data)=>{
            callback(data.city);
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function findCountryAll(callback){
    $.ajax({
        url:'/country/all',
        method: 'GET',
        success: (data)=>{
            callback(data);
        }
    }).fail((data)=>{
        console.log('findCountryAll Failed::::'+data);
    });
}
function findStateAll(countryId, callback){
    $.ajax({
        url:'/state/find?countryId='+countryId,
        method: 'GET',
        success: (data)=>{
            callback(data);
        }
    }).fail((data)=>{
        console.log('findStateAll Failed::::'+data);
    });
}
function findCityAll(stateId, callback){
    $.ajax({
        url:'/city/find?stateId='+stateId,
        method: 'GET',
        success: (data)=>{
            callback(data);
        }
    }).fail((data)=>{
        console.log('findStateAll Failed::::'+data);
    });
}

function reNameCountryName(id, changedName, callback){
    $.ajax({
        url:'/country/changeName?id='+id+'&changedName='+changedName,
        method: 'PUT',
        success: (data)=>{
            callback();
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function reNameStateName(id, changedName, callback){
    $.ajax({
        url:'/state/changeName?id='+id+'&changedName='+changedName,
        method: 'PUT',
        success: (data)=>{
            callback();
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function reNameCityName(id, changedName, callback){
    $.ajax({
        url:'/city/changeName?id='+id+'&changedName='+changedName,
        method: 'PUT',
        success: (data)=>{
            callback();
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}

function deleteCity(id, callback){
    $.ajax({
        url:'/city/delete?id='+id,
        method: 'DELETE',
        success: (data)=>{
            callback();
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function deleteState(id, callback){
    $.ajax({
        url:'/state/delete?id='+id,
        method: 'DELETE',
        success: (data)=>{
            callback();
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function deleteCountry(id, callback){
    $.ajax({
        url:'/country/delete?id='+id,
        method: 'DELETE',
        success: (data)=>{
            callback();
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}

/////////////////LANGUAGE PAGE
function openLanguagesTab(){
    newContent =
    '<div id="LanguagesTabDiv"><div id="newLanguageBox"><input type="text" style="width:200px;" id="newLanguageName" class="form-control d-inline-block m-4"><button id="newLanguageButton" class="btn btn-primary">Yeni Dil Kaydet</button></div><table class="table table-striped" id="languagesTable"> <thead> <tr style="font-size:0.9rem;"> <th> <input id="checkAllLanguages" type="checkbox" /> </th> <th>ID</th> <th>Language</th> <th>-</th> </tr> </thead> </table></div>'
    $('#content').append(newContent);
    refreshLanguageList();
    $('#newLanguageButton').on('click', function(){
        $('#sucessInfoChangeLanguageName').remove();
        if($('#newLanguageName').val() != ''){
            $.ajax({
                url:'/add/language?language='+$('#newLanguageName').val(),
                method: 'PUT',
                success: (data)=>{
                    $('#newLanguageBox').append('<div class="text-success info" id="sucessInfoChangeLanguageName">Kayıt Oluşturuldu.</div>');
                    refreshLanguageList();
                    $('#newLanguageName').val('');
                }
            }).fail((data)=>{
                console.log('fail: '+data);
            });
        }
        else{
            $('#newLanguageBox').append('<div class="text-danger info" id="sucessInfoChangeLanguageName">Alan Boş.</div>');
        }
    });
};

function closeLanguagesTab(){
    $('#LanguagesTabDiv').remove();
    
}
function addLanguageToLanguageList(language){
    newLine =
    '<tr style="font-size:0.9rem;" class="languageTr"> <td class="text-center" style="width:15px;"> <input id="checkAllLanguages" type="checkbox" /> </td> <td class="text-center" style="width:35px; overflow: hidden;">'+language.id+'</td> <td id="languageNameTd'+language.id+'">'+language.language+'</td><td style="width:200px; id="languageExtraBox'+language.id+'"> <button class="btn btn-primary btn-sm py-0 px-1 languageDetailsButton" id="editLanguage'+language.id+'" value="" style="font-size:0.8rem; margin-right: 10px;"> Change Name</button> <button class="btn btn-danger btn-sm py-0 px-1 languageDeleteButton" id="deleteLanguage'+language.id+'" style="font-size:0.8rem;"> Delete</button> </td> </tr>'
    $('#languagesTable').append(newLine);
    $('#editLanguage'+language.id).on('click', function(){
        selectedLanguageName = $("#languageNameTd"+language.id).text();
        $("#languageNameTd"+language.id).empty();
        $("#languageNameTd"+language.id).append('<input type="text" id="changeLanguageNameText'+language.id+'" class="form-control-sm mr-2" value="'+selectedLanguageName+'">');
        $("#languageNameTd"+language.id).append('<button id="changeLanguageNameButton'+language.id+'" class="btn btn-sm btn-success mx-2">Kaydet</button>');
        $("#languageNameTd"+language.id).append('<button id="cancelLanguageNameButton'+language.id+'" class="btn btn-sm btn-warning">Iptal</button>');
        $('#editLanguage'+language.id).hide();
        $('#changeLanguageNameButton'+language.id).on('click', function(){
            $('#sucessInfoChangeLanguageName').remove();
            if($('#changeLanguageNameText'+language.id).val() != ''){
                reNameLanguageName(language.id, $('#changeLanguageNameText'+language.id).val(), ()=>{
                    $('#newLanguageBox').append('<div class="alert alert-success" id="sucessInfoChangeLanguageName">Isim Degistirildi...</div>');
                    $('#changeLanguageNameButton'+language.id).remove();
                    $('#cancelLanguageNameButton'+language.id).remove();
                    $('#editLanguage'+language.id).show();
                    refreshLanguageList();
                });
            }
            else{
                $('#newLanguageBox').append('<div class="alert alert-danger" id="sucessInfoChangeLanguageName">Alan Boş Birakilamaz...</div>');
            }
        });
        $('#cancelLanguageNameButton'+language.id).on('click', function(){
            $('#changeLanguageNameButton'+language.id).remove();
            $('#cancelLanguageNameButton'+language.id).remove();
            $('#editLanguage'+language.id).show();
            refreshLanguageList();
        });
    });
    $('#deleteLanguage'+language.id).on('click', function(){
        deleteLanguage(language.id, ()=>{
            $('#sucessInfoChangeLanguageName').remove();
            $('#newLanguageBox').append('<div class="alert alert-success" id="sucessInfoChangeLanguageName">Dil Silindi...</div>');
            refreshLanguageList();
        });
    });
}
function refreshLanguageList(){
    var Languages = [];
    contentDisable();
        $.ajax({
            url:'/language/all',
            method: 'GET',
            success: (language)=>{
                contentEnable();
                clearLanguageList();
                Languages = language;
                Languages.forEach(language => {
                    addLanguageToLanguageList(language);
                });
                contentEnable();
            }
        })
}
function clearLanguageList(){
    $('.languageTr').remove();
}
function reNameLanguageName(id, changedName, callback){
    $.ajax({
        url:'/language/changeName?id='+id+'&changedName='+changedName,
        method: 'PUT',
        success: (data)=>{
            callback();
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function deleteLanguage(id, callback){
    $.ajax({
        url:'/language/delete?id='+id,
        method: 'DELETE',
        success: (data)=>{
            callback();
        }
    }).fail((data)=>{
        console.log('fail: '+data);
    });
}
function findLanguageAll(callback){
    $.ajax({
        url:'/language/all',
        method: 'GET',
        success: (data)=>{
            callback(data);
        }
    }).fail((data)=>{
        console.log('findCountryAll Failed::::'+data);
    });
}