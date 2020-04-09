$('#login').on('click', ()=>{
    $.ajax({
        url:'/panel/login/verify?username='+$('#username').val()+'&password='+$('#password').val(),
            method: 'GET',
            //data: {Slanguage, Scountry, Sduration, Saccommodation},
            success: (data)=>{
                console.log('token: '+data);
                window.location.href = '/panel/in';
            }
    }).fail((data)=>{
        console.log('fail: '+data.token);
    });
});

$('#clicked').on('click', ()=>{
    alert('test');
});