$('#loginButton').on('click', function(){
    $('#alertMessage').addClass('display-hide');
    var l = Ladda.create(this);
    l.start();
    if(checkBoxes() == true){
        $.ajax({
            url:'/panel/login/verify?username='+$('#username').val()+'&password='+$('#password').val(),
            method: 'GET',
            //data: {Slanguage, Scountry, Sduration, Saccommodation},
            success: (data)=>{
                if(data.status != false){
                    console.log('token: '+data);
                    window.location.href = '/panel/in';
                }
                else{
                    l.stop();
                    $('#alertMessage span').text('Username Or Password is not valid..')
                    $('#alertMessage').removeClass('display-hide');
                }
            }
        }).fail((data)=>{
            console.log('fail: '+data.token);
        });
    }
    else{
        l.stop();
    }
});

function checkBoxes(){
    if($('#username').val() == '' && $('password').val() == ''){
        $('#alertMessage span').text('Enter any username and password.')
        $('#alertMessage').removeClass('display-hide');
        return false;
    }
    if($('#username').val() == ''){
        $('#alertMessage span').text('Enter any username.')
        $('#alertMessage').removeClass('display-hide');
        return false;
    }
    else if($('password').val() == ''){
        $('#alertMessage span').text('Enter any password.')
        $('#alertMessage').removeClass('display-hide');
        return false;
    }
    else{
        console.log('true;')
        return true;
    }
}
