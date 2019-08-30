$(function () {
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var ws_path = ws_scheme + '://' + window.location.host + "/monitor/stream/";
    var socket = new ReconnectingWebSocket(ws_path);

    socket.onmessage = function (message) {
        var data = message.data;
        if (data){
            data = JSON.parse(data);
            var common = data.common;
            var mem = data.mem_info;
            var vir = data.virtual;
            plotCommonInfo(common);
            plotMemInfo(mem);
            virtualMem(vir);
        }


    function plotCommonInfo(data){
        var values = getXandY(data);
        var commonEl = document.getElementById('common');
        var d =  [{
            values: values[1],
            labels: values[0],
            type: 'pie'}];

        var layout = {
            showlegend: true
        };

        Plotly.newPlot(commonEl, d, layout, {displayModeBar: false});
    };


    function plotMemInfo(data){
        var values = getXandY(data);
        var memEl = document.getElementById('mem');
        var d =  [{
            y: values[1],
            x: values[0],
            type: 'bar',
            orientation: 'v',
        }];
        var layout = {
            showlegend: false
        };

        Plotly.newPlot( memEl, d, layout, {displayModeBar: false});
    }

    function virtualMem(data){
        Object.keys(data).forEach(function(key){
            document.getElementById(key).innerHTML = data[key];
        });
    
    }

    function getXandY(obj){
        var x = [];
        var y = [];
        Object.keys(obj).forEach(function(key){
                x.push(key);
                y.push(obj[key]);
            });
        return [x, y];
    }
}
});