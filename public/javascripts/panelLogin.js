$('#login').on('click', ()=>{
    $.ajax({
        url:'/panel/login/verify?username='+$('#username').val()+'&password='+$('#password').val(),
            method: 'GET',
            //data: {Slanguage, Scountry, Sduration, Saccommodation},
            success: (data)=>{
                console.log('token: '+data);
                window.location.href = '/panel/in?token='+data;
            }
    }).fail((data)=>{
        console.log('fail: '+data.token);
    });
    //ajaxla token istenecek. token bulursa butonun ismini degistirecek ve triggerlayacak.
});

$('#clicked').on('click', ()=>{
    alert('test');
});