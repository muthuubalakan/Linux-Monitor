window.onload = $(function () {
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var ws_path = ws_scheme + '://' + window.location.host + "/monitor/stream/";
    var socket = new ReconnectingWebSocket(ws_path);
    var counter = 0;
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
            var uptime = data.uptime;
            var swap  = data.swap;
            var cpuload = data.cpuload;
            cpuloadTimeseriesPlot(cpuload);
            setUptime(uptime);
            partition(partitions);
            plotCommonInfo(common);
            plotVirtualInfo(vir);
            otherMemInfo(mem);
            plotSwap(swap);
        }

        else if (pathname == '/process'){

            var data = message.data;
            data = JSON.parse(data).process;
            var pdiv = document.getElementById('process');
            var tableStr = createTable();
            var body = '';

            try {
                data.forEach(element => {

               if (element['username'] == 'root'){
                body += '<tr style="background: #aebfbe; color: black;">'

               }
               else{
                body += '<tr>'; 
               }
               
               body += '<td>' + element['Pid'] + '</td>' +
		       '<td>' + element['Name'] + '</td>' +
               '<td>' + element['State'] + '</td>' +
               '<td>' + element['username'] + '</td></tr>' 
                });
                var footer = '</tbody></table>';
                pdiv.innerHTML = tableStr + body + footer;
                            
            } catch (error) {
                
            }
 
        }
    
        var processLink = document.getElementById('process-link');
        // var memLink = document.getElementById('mem-link');
    
        // memLink.onclick = ()=> {
        //     socket.send(JSON.stringify({
        //         command: 'memory'
        //     }));
        // };
    
        processLink.onclick = ()=>{
            socket.send(JSON.stringify({
                command: 'process'
            }));
        };

    
    function partition(partitions){
        var par = document.getElementById('total-partition');
        par.innerHTML = partitions.length;
    }

    function setUptime(upt){

        var uptEl = document.getElementById('uptime');
        uptEl.innerHTML = upt;
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
                t:0,
                r:0,
                b:0
            }
        };

        Plotly.newPlot(commonEl, d, layout, {displayModeBar: false});
    };


    function plotSwap(data){
        var values = getSwapOverview(data);
        var commonEl = document.getElementById('swap');
        var d =  [{
            values: values[1],
            labels: values[0],
            type: 'pie'}];

        var layout = {
            showlegend: true,
            margin:{
                l:0,
                t:0,
                r:0,
                b:0
            }
        };

        Plotly.newPlot(commonEl, d, layout, {displayModeBar: false});
    };

    function cpuloadTimeseriesPlot(data){
        var commonEl = document.getElementById('timeseries');
        var d =  [{
            y: [data['load']],
            type: 'line'}];

        var layout = {
            showlegend: false,
  
        };

        Plotly.plot(commonEl, d, layout, {displayModeBar: false});

        setInterval(function(){
            Plotly.extendTraces(commonEl, {y:[[data['load']]]}, [0]);
            counter++;
            if (counter > 500) {
                Plotly.relayout(
                    commonEl, {
                        xaxis: {
                            range: [counter-500, counter]
                        }
                    });
            } });
    };


    function plotVirtualInfo(data){
        var values = getVirtualOverview(data);
        var memEl = document.getElementById('virtual');
        var d =  [{
            values: values[1],
            labels: values[0],
            type: 'pie',
            // orientation: 'v',
        }];
        var layout = {
            showlegend: true,
            margin:{
                l:0,
                t:0,
                r:0,
                b:0
            }
        };

        Plotly.newPlot( memEl, d, layout, {displayModeBar: false});
    
    }

    function otherMemInfo(data){
        for (var property in data) {
  
            if (data.hasOwnProperty(property)) {
                var El = document.getElementById(property);
                if (El) {
                    El.innerHTML= data[property] + ' Gb';
                }
                }
              }        
    }

    function getMemOverview(obj){
        var free = obj['free'];
        var used = obj['used'];
        return [['Used', 'Available'], [used, free]];
    }

    function getSwapOverview(obj){
        var free = obj['SwapFree'];
        var used = obj['SwapTotal'] - free;
        return [['Used', 'Available'], [used, free]];
    }

    function getVirtualOverview(obj){
        var free = obj['VmallocUsed'];
        var used = obj['VmallocTotal'] - free;
        return [['Used', 'Available'], [used, free]];
    }
}
});