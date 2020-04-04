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
            content: [
                {
                    columns: [
                        {
                            text: [
                                    {text: 'Customer Copy - Non Fiscal \n \n', style: 'subheader'},
                                    {text: 'Date: + '+rHour+':'+rMinute+'    '+rDay+'/'+rMonth+'/'+rYear+'\n \n', style: 'normal'},
                                    {text: 'Eduvizyon \n \n', style: 'big', bold: true},
                                    {text: 'Zeytinlik Mahallesi Fişekhane Caddesi, Türkçü Sokak Aral Apt. No : 2 - Daire : 7, 34140 Bakırköy\n\n', style:'normal'},
                                    {text: '(0212) 543 58 06 \n0 535 712 07 90 \nFaks: 0 212 543 58 06\n\ninfo@eduvizyon.com', style:'normal'}
                                    
                            ]
                        },
                        {
                            text:[
                                {text: 'Online Reservation Application\n', style:'normal', bold:true, alignment: 'center'},
                                {text : 'Offer No:'+id, style:'normal', bold:true, alignment:'center'}
                                ], margin: [0, 190, 0, 0]
                        },
                        {
                            text: [
                                {text:'LOGO\n\n',style:'big',bold:true},
                                {text:'Adres;;;\n'+'tel:'+'\n'+'Fax:'+'\n'+'E-mail:'+'\n'+'web',style:'normal'},
                                {text:'tel:',style:'normal'}
                                ], margin: [0, 90, 0, 00]
                        }
                    ]
                },
                {
                    text:[
                        {text:'\nThank you forcompleting reservation at the language school of ', style:'small'},
                        {text: 'SCHOOL ', style:'small', bold:true},
                        {text: 'Please review reservation details in the body of this invoice as follow:\n\n', style:'small'}
                        ], margin: [0, 30, 0, 0]
                },
                {
                    table: {
                        widths: [100, '*'],
                        body: [
                            [{text:'Student No:',style:'normal', bold:true, fillColor:'lightgrey'}, {text:'Student Name:',style:'normal', bold:true, fillColor:'lightgrey'}]
                        ]
                    }
                },
                {
                    table: {
                        widths: [50, '*',50, 50, 50, 50, 50],
                        body: [
                            [
                                {text:'Code',style:'normal', bold:true, fillColor:'lightgrey'},
                                {text:'Reservation Details',style:'normal', bold:true, fillColor:'lightgrey'},
                                {text:'From',style:'normal', bold:true, fillColor:'lightgrey'},
                                {text:'To',style:'normal', bold:true, fillColor:'lightgrey'},
                                {text:'Duration',style:'normal', bold:true, fillColor:'lightgrey'},
                                {text:'Amount\nGBP',style:'normal', bold:true, fillColor:'lightgrey'},
                                {text:'Amount\nUSD',style:'normal', bold:true, fillColor:'lightgrey'},
                            ],
                            [
                                {text:'0',style:'small', border: [true, false, true, false], bold:true},
                                {text:'Example Course\n\n(21 Lesson/Week)\n(21 hrs perweek)\n( RequiredLevel : Beginner)\n( Study time: Morning )',style:'small', border: [true, false, true, false], bold:true},
                                {text:'01/10/2020',style:'small', border: [true, false, true, false], bold:true},
                                {text:'01/02/2021',style:'small', border: [true, false, true, false], bold:true},
                                {text:'16 Week(s)',style:'small', border: [true, false, true, false], bold:true},
                                {text:'1.250',style:'small', border: [true, false, true, false], bold:true},
                                {text:'1.600',style:'small', border: [true, false, true, false], bold:true},
                            ],
                            [
                                {text:'1',style:'small', border: [true, false, true, false], bold:true},
                                {text:'Accommodation -- Single room- Half board',style:'small', border: [true, false, true, false], bold:true},
                                {text:'01/10/2020',style:'small', border: [true, false, true, false], bold:true},
                                {text:'01/02/2021',style:'small', border: [true, false, true, false], bold:true},
                                {text:'16 Week(s)',style:'small', border: [true, false, true, false], bold:true},
                                {text:'600',style:'small', border: [true, false, true, false], bold:true},
                                {text:'800',style:'small', border: [true, false, true, false], bold:true},
                            ],
                            [
                                {text:'',style:'small', border: [false, true, false, false], colSpan: 3, bold:true},
                                {},
                                {},
                                {text:'Total Cost',style:'normal', colSpan: 2, bold:true, alignment:'center', fillColor:'lightgrey', margin: [5, 5, 5, 5]},
                                {},
                                {text:'1.850',style:'normal', bold:true},
                                {text:'2.400',style:'normal', bold:true},
                            ],
                        ]
                    },
                    margin: [0, 10, 0, 40]
                },
                {text:'This quotation is valid for 10 days.\n\nDear Student, you can pay the course invoice by the following methods:\n\n', style:'f8d5', bold:true},
                {
                    ol:[
                        {
                            text:
                            [
                                {text:'Bank Transfer:', bold:true},
                                {text:'You can do a bank transfer to theaccount of the school or to any account of our partners. Please see second page of the invoice.'}
                                ]
                        },
                        {
                            text:
                            [
                                {text:'Visit offices of our partners ', bold:true},
                                {text:'where you can pay by cash or using acreditcard. To know our partners locations, please see third page.\n\n'}
                                ]
                        }
                        ],style:'f8d5'
                },
                {
                    ul:[
                        {
                            text:
                            [
                                {text:'Prices are 100%identicalto the school prices. In somecasesand after thefinalconfirmation, there mightarisesome minor differences in the prices dueto somechanges in costs ofaccommodation or health insurancein holidays or during a peak season\n\n'},
                                ]
                        },
                        {
                            text:
                            [
                                {text:'This invoice has been completed through theinternet. In case youwould liketo continuethe process in terms ofaccommodation,airport pickup and to complete visa services by there levant consultant by an office, the office shall beliableto additional administrative costs.\n\n'}
                                ]
                        },
                        {
                            text:
                            [
                                {text:'The pricein (USD) will beadjusted according theexchangerate when you book you course\n\n\n'}
                                ]
                        }
                        ],style:'f8d5'
                },
                {
                    text:[
                        {text:'Please send the payment receipt to the following e-mail\n'},
                        {text:'info@eduvizyon.com\n\n'},
                        {text:'This invoice was issued by Eduvizyon\n'}
                        ], bold:true, style:'normal', alignment:'center'
                },
                {text:'Visit us at: www.eduvizyon.com', style:'normal', alignment:'center'}
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
                subheader: {
                    fontSize: 15,
                    bold: true
                },
                quote: {
                    italics: true
                },
                small: {
                    fontSize: 8
                },
                normal: {
                    fontSize: 10
                },
                big: {
                    fontSize:12
                },
                bold: {
                    bold: true
                },
                f8d5:{
                    fontSize: 8.5
                }
            },
            defaultStyle: {
                columnGap: 20
            }
        }
        /*var docDefinition = {
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
        }*/
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        var win = window.open('', '_blank');
        pdfDocGenerator.open({}, win);
    })
})