$(document).ready(function(){
    $('#showSchools').on('click', function(){
        $('#content').css('pointer-events', 'none');
        $('#content').css('opacity', '0.4');
        var Schools = [];
        $.ajax({
            url:'/course/all',
            method: 'GET',
            success: (school)=>{
                closeCountriesTab();
                $('#content').css('pointer-events', 'auto');
                $('#content').css('opacity', '1');
                closeSchoolsTab();
                openSchoolsTab();
                clearSchoolList();
                Schools = school;
                Schools.forEach(school => {
                    addSchoolToSchoolList(school);
                });
            }
        })
    });
    $('#showCountries').on('click', function(){
        $('#content').css('pointer-events', 'none');
        $('#content').css('opacity', '0.4');
        $.ajax({
            url:'/country/all',
            method: 'GET',
            success: (data)=>{
                closeSchoolsTab();
                closeCountriesTab();
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
                        console.log('here1');
                        if($('#CountryListSelect').val() != ''){
                            contentDisable();
                            console.log('here2');
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
});


function openSchoolsTab(){
    newContent =
    '<table class="table table-striped" id="schoolsTable"> <thead> <tr style="font-size:0.9rem;"> <th> <input id="checkAllSchools" type="checkbox" /> </th> <th>ID</th> <th>School Name</th> <th>Place</th> <th>Price</th> <th>Acco.</th> <th>Airport</th> <th>H.Ins.</th> <th>-</th> </tr> </thead> </table>'
    $('#content').append(newContent);
}
function closeSchoolsTab(){
    $('#schoolsTable').remove();
}
function addSchoolToSchoolList(school){
    newLine =
    '<tr style="font-size:0.9rem;" class="schoolTr"> <td class="text-center" style="width:15px;"> <input id="checkAllSchools" type="checkbox" /> </td> <td class="text-center" style="width:35px; overflow: hidden;">'+school.courseId+'</td> <td>'+school.name+'</td> <td>'+school.country+' '+school.state+' '+school.city+'</td> <td>0</td> <td>'+school.accommodationPrice+'</td> <td>'+school.airportPrice+'</td> <td>'+school.hInsurancePrice+'</td> <td style="width:150px;"> <button class="btn btn-primary btn-sm py-0 px-1" id="schoolDetailsButton" value="'+school.courseId+'" style="font-size:0.8rem; margin-right: 10px;"> Details</button> <button class="btn btn-danger btn-sm py-0 px-1" id="schoolDeleteButton" value="'+school.courseId+' style="font-size:0.8rem;"> Delete</button> </td> </tr>'
    $('#schoolsTable').append(newLine);
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