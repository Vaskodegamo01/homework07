let url = "http://127.0.0.1:3333/messages";
lastdatatime = new Date();
queryparam = {"datatime" : window.lastdatatime};

$( document ).ready(function() {
    $("#btn").click(
        function(){
            let idForm = $("#ajax_form");
            let idResultForm = $("#result_form");
            sendAjaxForm(idResultForm, idForm, url);
            return false;
        }
    );
});

function getFormData($form){
    let unindexed_array = $form.serializeArray();
    let indexed_array = {};
    $.map(unindexed_array, function(n){
        indexed_array[n['name']] = n['value'];
    });
    return indexed_array;
}
function sendAjaxForm(result_form, ajax_form, url) {
    $.ajax({
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Accept","application/json");
        },
        url: url, //url страницы
        type: "POST", //метод отправки
        dataType: "json",
        data: JSON.stringify(getFormData(ajax_form)),
        processData: false,
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
    let items = '<ul>';
    let div = $("#mydiv");
    if(result.length >= 30 ){
        result.reverse().forEach((el) => {
            items += '<ul class="massage">';
            items += '<li class="massage_who">' + el.author + '</li>';
            items += '<li class="massage_text">' + el.message + '</li>';
            items += '<li class="massage_time">' + el.datetime.split('T')[0] + " " + el.datetime.split('T')[1].split('.')[0] + '</li>';
            items += '</ul>';
        });
        items += '</ul>';
        div.html(items);
    }else{
          result.reverse().forEach((el) => {
            items += '<ul class="massage">';
            items += '<li class="massage_who">' + el.author + '</li>';
            items += '<li class="massage_text">' + el.message + '</li>';
            items += '<li class="massage_time">' + el.datetime.split('T')[0] + " " + el.datetime.split('T')[1].split('.')[0] + '</li>';
            items += '</ul>';
        });
        items += '</ul>';
        items += div.html();
        div.html(items);
    }
}
