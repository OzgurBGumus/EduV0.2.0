var schoolName;
var rMinute;
var rHour;
var rDay;
var rMonth;
var rYear;
var name;
var surname;
var email;
var nationality;
var residence;
var city;
var mobileNo;
var communication;
var notes;
var sDay;
var sMonth;
var sYear;
var accommodation;
var Paccommodation;
var airport;
var Pairport;
var hInsurance;
var PhInsurance;
var schoolId;
$(document).ready(function(){
    var id = $('#reservationId').text();
    $.ajax({
        url:'/reservation/getDetails?reservationId='+id,
        method: 'GET',
        success: (data)=>{
            console.log(data);
            rMinute = data.reservationDateMinute;
            rHour = data.reservationDateHour;
            rDay = data.reservationDateDay;
            rMonth = data.reservationDateMonth;
            rYear = data.reservationDateYear;
            name = data.name;
            surname = data.surname;
            email = data.email;
            nationality = data.nationality;
            residence = data.residence;
            city = data.city;
            mobileNo = data.mobileNo;
            communication = data.communication;
            notes = data.notes;
            sDay = data.startDateDay;
            sMonth = data.startDateMonth;
            sYear = data.startDateYear;
            accommodation = data.accommodation;
            Paccommodation = data.Paccommodation;
            airport = data.airport;
            Pairport = data.Pairport;
            hInsurance = data.hInsurance;
            PhInsurance = data.PhInsurance;
            schoolId = data.schoolId;
            if(Paccommodation == '')
                Paccommodation = '0';
            if(Pairport == '')
                Pairport = '0';
            if(PhInsurance == '')
                PhInsurance = '0';
            $.ajax({
                url: '/findSchool/id?id='+schoolId,
                method: 'GET',
                success: (data)=>{
                    schoolName = data.name;
                    $('#pdfViewer').removeClass('disabled');
                }
            }).fail((data)=>{
                console.log('error: '+data);
            })
        }
    }).fail((data)=>{
        window.location.href='https://www.google.com';
    });
    $('#pdfViewer').on('click', function(){
        var docDefinition = {
            info: {
                title: 'awesome Document',
                author: 'john doe',
                subject: 'subject of document',
                keywords: 'keywords for document',
            },
            content: [
                'rezervation Id: '+id,
                'Name: '+ name,
                'Surname: '+ surname,
                'created Time: '+ rHour+':'+rMinute+'    '+rDay+'/'+rMonth+'/'+rYear,
                'email: '+ email,
                'mobile Number: '+mobileNo,
                'course Start Date: '+sDay+'/'+sMonth+'/'+sYear,
                '('+Paccommodation+')Accommodation? --'+accommodation,
                '('+Pairport+')Airport Pickup? --'+airport,
                '('+PhInsurance+')Health Insurance? --'+hInsurance,

            ]
        }
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        var win = window.open('', '_blank');
        pdfDocGenerator.open({}, win);
    })
})