//http://pubs.vmware.com/vfabric51/index.jsp?topic=/com.vmware.vfabric.rabbitmq.2.8/rabbit-web-docs/stomp.html
"use strict";
if(!priceCheck){ var priceCheck = {}; }
if(!sock){ var sock = {}; sock.client = {}; }

sock.init = function(){
    var rabbit = "http://188.226.241.20:15674/stomp";
    var ws = new SockJS(rabbit);
    var client = Stomp.over(ws);
    client.heartbeat.outgoing = 0;
    client.heartbeat.incoming = 0;
    client.connect('inboundWorkPublisher', 'wellknownpassword', sock.on_connect, sock.on_error, 'websock');
    return client;
};

sock.client.debug = function() {
    if (window.console && console.log && console.log.apply) {
        console.log.apply(console, arguments);
    }
};

sock.send = function(data) {
    sock.client.send('/exchange/inboundWorkExchange', {"reply-to":"/temp-queue/queue"}, data);
};

sock.on_connect = function(x) {
    // something like followed can be done here, to connect to some topic on websocket initialization
    //id = client.subscribe('/topic/bunny', function(d) {});
};

// Default receive callback to get message from temporary queues
// Auto-bind to anonymous queue declared while specifying reply-to header
sock.client.onreceive = function(m) {
    console.log(m.body);
};

sock.on_error = function() {
    console.log('error');
};

priceCheck.handleFormSubmit = function() {
    sock.send($("#lookfor").val());
};

$(function(){
    sock.client = sock.init();
});