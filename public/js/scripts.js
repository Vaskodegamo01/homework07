let url = "http://127.0.0.1:3333/messages";
lastdatatime = new Date();
queryparam = {"datatime" : window.lastdatatime};

$(()=>{

    $("#btn").click((e)=>{
        let idForm = $("#ajax_form");
        if(!idForm[0].checkValidity()){
            $('<input type="submit">').hide().appendTo(idForm).click().remove();
            return;
        }
        e.preventDefault();
        let idResultForm = $("#result_form");
        sendAjaxForm(idResultForm, idForm, url);
        return false;
    });
});


function sendAjaxForm(result_form, ajax_form, url) {
    const data = new FormData(document.getElementById("ajax_form"));
    $.ajax({
        url: url, //url страницы
        type: "POST", //метод отправки
        data: data,
        processData: false,
        contentType: false,
        success: function(response) { //Данные отправлены успешно
            result = JSON.stringify(response);
            result_form.html('Данные отправлены успешно' + "<br>" + result);
        },
        error: function(response) { // Данные не отправлены
            result_form.html('Ошибка. Данные не отправлены.'+ "<br>" + response.status);
        }
    });
}
function successCallback(response) {
    if(response[0] != null) {
        window.lastdatatime = response[response.length - 1].datetime;
        window.queryparam = {"datatime" : window.lastdatatime};
    }
    list(response);
}

function getJSON(url,data,datatype) {
   return $.get(url, data, successCallback, datatype);
}

function runapp() {
    getJSON(url,'', "json");
    setTimeout(()=>{setInterval(()=>getJSON(url,window.queryparam, "json"), 3000)},3000);
}

function list(result) {
    if(result[0] != null){
    let items = '<ul>';
    let div = $("#mydiv");
    if(result.length >= 30 ){
        result.reverse().forEach((el) => {
            if(el.author==="") el.author = "anonymous";
            items += '<div class="media-block">';
            if(el.image) {
                items += '<div>';
                items += '<img class="preview_image" src=http://localhost:3333/uploads/' + el.image + 'alt="">';
                items += '</div>';
            }
            items += '<div>';
            items += '<ul class="massage">';
            items += '<li class="massage_who">' + el.author + '</li>';
            items += '<li class="massage_text">' + el.message + '</li>';
            items += '<li class="massage_time">' + el.datetime.split('T')[0] + " " + el.datetime.split('T')[1].split('.')[0] + '</li>';
            items += '</ul>';
            items += '</div>';
            items += '</div>';
        });
        items += '</ul>';
        div.html(items);
    }else{
          result.reverse().forEach((el) => {
              if(el.author==="") el.author = "anonymous";
              items += '<div>';
              if(el.image) {
                  items += '<div>';
                  items += '<img class="preview_image" src=http://localhost:3333/uploads/' + el.image + ' alt="">';
                  items += '</div>';
              }
              items += '<div>';
              items += '<ul class="massage">';
              items += '<li class="massage_who">' + el.author + '</li>';
              items += '<li class="massage_text">' + el.message + '</li>';
              items += '<li class="massage_time">' + el.datetime.split('T')[0] + " " + el.datetime.split('T')[1].split('.')[0] + '</li>';
              items += '</ul>';
              items += '</div>';
              items += '</div>';
        });
        items += '</ul>';
        items += div.html();
        div.html(items);
    }
}}
