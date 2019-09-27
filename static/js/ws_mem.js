$(function () {
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var ws_path = ws_scheme + '://' + window.location.host + "/monitor/stream/";
    var socket = new ReconnectingWebSocket(ws_path);

    socket.onopen = function(){
        var pathname = window.location.pathname;
        var query = undefined;

        if (pathname == '/process'){
            query = 'process'
        }
        else if (pathname == '/'){
            query = 'memory'
        }
        socket.send(JSON.stringify({
            'command':query
        }));
    }


function createTable(){

    return '<table class="table table-hover">' +
		'<thead><tr>' +
		'<th scope="col">PID</th>' +
		'<th scope="col">Name</th>' +
		'<th scope="col">State</th>' +
        '<th scope="col">User</th>' 
        +'</tr> </thead> <tbody> '
}

    socket.onmessage = function (message) {
        var pathname = window.location.pathname;
        if (pathname == '/'){
            var data = message.data;
            data = JSON.parse(data);
            var common = data.common;
            var mem = data.mem_info;
            var vir = data.virtual;
            var partitions = data.partitions;
            console.log(partitions)
            partition(partitions);
            plotCommonInfo(common);
            plotMemInfo(mem);
            virtualMem(vir);
        }
        else if (pathname == '/process'){

            var data = message.data;
            data = JSON.parse(data).process;
            var pdiv = document.getElementById('process');
            var tableStr = createTable();
            var body = '';

            try {
                data.forEach(element => {
                    body += '<tr>' +
		       '<td>' + element['Pid'] + '</td>' +
		       '<td>' + element['Name'] + '</td>' +
               '<td>' + element['State'] + '</td>' +
               '<td>' + element['user'] + '</td>' 
                });
                var footer = '</tbody></table>';
                pdiv.innerHTML = tableStr + body + footer;
                            
            } catch (error) {
                
            }
 
        }
    
        var processLink = document.getElementById('process-link');
        var memLink = document.getElementById('mem-link');
    
        memLink.onclick = function(){
            socket.send(JSON.stringify({
                command: 'memory'
            }));
        };
    
        processLink.onclick = ()=>{
            socket.send(JSON.stringify({
                command: 'process'
            }));
        };

    
    function partition(partitions){
        var par = document.getElementById('total-partition');
        console.log(par)
        par.innerHTML = partitions.length;
    }


    function plotCommonInfo(data){
        var values = getMemOverview(data);
        var commonEl = document.getElementById('common');
        var d =  [{
            values: values[1],
            labels: values[0],
            type: 'pie'}];

        var layout = {
            showlegend: true,
            margin:{
                l:0,
                t:0
            }
        };

        Plotly.newPlot(commonEl, d, layout, {displayModeBar: false});
    };


    function plotMemInfo(data){
        var values = getXandY(data);
        var memEl = document.getElementById('mem');
        var d =  [{
            values: values[1],
            labels: values[0],
            name: "test",
            type: 'pie',
            // orientation: 'v',
        }];
        var layout = {
            showlegend: true,
            margin:{
                l:0,
                t:0
            }
        };

        Plotly.newPlot( memEl, d, layout, {displayModeBar: false});
    }

    function virtualMem(data){
        try {
            Object.keys(data).forEach(function(key){
                document.getElementById(key).innerHTML = data[key];
            });
        } catch (error) {
            
        }
    }

    function getMemOverview(obj){
        var free = obj['MemFree'];
        var used = obj['MemTotal'] - free;
        return [['Used', 'Available'], [used, free]];
    }
    
    function getXandY(obj){
        var x = [];
        var y = [];
        try {
            Object.keys(obj).forEach(function(key){
                x.push(key);
                y.push(obj[key]);
            });
            
        } catch (error) {
            
        }

        return [x, y];
    }
}
});