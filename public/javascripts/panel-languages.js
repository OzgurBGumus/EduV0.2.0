$(document).ready(function(){
    refreshLists();
    $('#createNewLanguageButton').on('click', ()=>{
        $('.addLanguageNameBox').removeClass('has-error');
        if($('#addLanguageName').val() == ''){
            $('.addLanguageNameBox').addClass('has-error');
        }
        else{
            $.ajax({
                url: '/find/language?language='+$('#addLanguageName').val(),
                method: 'PUT',
                success:(data,url)=>{
                    $('#addLanguageName').val('');
                    $('#closeCreateNewLanguage').trigger('click');
                    App.alert({ container: '#alertContainer',
                        type: 'success',
                        message:'Language Is Created...',
                        icon:'check', // alerts parent container place: 'append', // append or prepent in container type: 'success', // alert's type message: 'Test alert', // alert's message
                        close: true, // make alert closable reset: false, // close all previouse alerts first focus: true, // auto scroll to the alert after shown closeInSeconds: 10000, // auto close after defined seconds
                        icon: 'fa fa-check' // put icon class before the message });
                    });
                    refreshLists();
                }
            }).fail((data)=>{
                console.log('PUT /find/language/ fail:::'+data);
                App.alert({ container: '#alertContainer',
                        type: 'danger',
                        message:'Language Couldnt Created...',// alerts parent container place: 'append', // append or prepent in container type: 'success', // alert's type message: 'Test alert', // alert's message
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
        url:'/find/language',
        method:'GET',
        success:(data,url)=>{
            debugger;
            var newLanguageRow;
            data.forEach(element => {
                newLanguageRow =
                '<tr class="odd gradeX"> <td> <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input class="checkboxes" type="checkbox" value="1" /><span></span> </label> </td><td>'+element.language+'</td> <td><span class="label label-sm label-success"> Approved </span></td> <td> <div class="btn-group"> <button class="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">Actions<i class="fa fa-angle-down"></i></button> <ul class="dropdown-menu pull-left" role="menu"> <li><a data-toggle="modal" href="#'+element.language+'ChangeNameModal">Change Name</a></li></ul> </div> <!-- END EXAMPLE TABLE PORTLET--> </td> </tr>'
                $('#languageTable').append(newLanguageRow);
                newModal =
                '<div class="modal fade bs-modal-lg" id="'+element.language+'ChangeNameModal" tabindex="-1" role="dialog" aria-hidden="true"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button class="close" type="button" data-dismiss="modal" aria-hidden="true"></button> <h4 class="modal-title">['+element.language+'] Change City Name</h4> </div> <div class="modal-body"> <div class="form-body"> <div class="form-group"> <div class="col-md-6" id="'+element.language+'ChangeNameBox"> <label class="control-label" for="name">New Name</label> <div class="input-group-col-md-12"> <input class="form-control" id="'+element.language+'ChangeName" type="text" placeholder="NewName" /> </div> </div> </div> </div> <div class="clearfix"></div> </div> <div class="modal-footer"> <button class="btn dark btn-outline closeModal" id="" type="button" data-dismiss="modal">Close</button> <button class="btn green ladda-button mt-progress-demo" id="'+element.language+'ChangeNameButton" type="button" data-loading-text="Loading..." data-style="slide-left"><span class="ladda-label">Change Name</span><span class="ladda-spinner"></span><span class="ladda-spinner"></span> <div class="ladda-progress" style="width: 115px;"></div> </button> </div> </div> <!-- /.modal-content--> <!-- /.modal-dialog--> </div> </div>'
                $('.page-content').append(newModal);
                $('#'+element.language+'ChangeNameButton').unbind().on('click', function(){
                    debugger;
                    if($('#'+element.language+'ChangeName').val() == ''){
                        $('#'+element.language+'ChangeNameBox').addClass('has-error');
                    }
                    else{
                        changeLanguageName(element.language, $('#'+element.language+'ChangeName').val());
                    }
                });
            });
            $('#languageTableBox').DataTable();
        }
    })
}
function changeLanguageName(language, name){
    console.log(language);
    $.ajax({
        url:'/find/language?language='+language+'&name='+name,
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
                    $('#'+language+'ChangeName').val('');
                    refreshLists();
        }
    })
}