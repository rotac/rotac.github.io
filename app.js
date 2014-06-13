//http://pubs.vmware.com/vfabric51/index.jsp?topic=/com.vmware.vfabric.rabbitmq.2.8/rabbit-web-docs/stomp.html
"use strict";
if(!priceCheck){ var priceCheck = {}; }
if(!sock){ var sock = {}; sock.client = {}; }

priceCheck.handleFormSubmit = function() {
    sock.client = sock.init();
};

sock.init = function(){
    var rabbit = "http://188.226.241.20:15674/stomp";
    var ws = new SockJS(rabbit);
    var client = Stomp.over(ws);
    client.heartbeat.outgoing = 0;
    client.heartbeat.incoming = 0;
    client.connect('inboundWorkPublisher', 'wellknownpassword', sock.on_connect, sock.on_error, 'websock');
    return client;
};

sock.on_connect = function(x) {
    sock.send($("#lookfor").val());
};

sock.send = function(data) {
    sock.client.send('/exchange/inboundWorkExchange', {"reply-to":"/temp-queue/queue"}, data);
    sock.createSubscription();
};

sock.createSubscription = function(){
    sock.client.subscriptions['/temp-queue/queue'] = sock.handleResponse;
};

sock.handleResponse = function(message) {
    $("#response").html(message.body);
    sock.client.disconnect(function() {});
};

sock.client.debug = function() {
    if (window.console && console.log && console.log.apply) {
        console.log.apply(console, arguments);
    }
};

sock.on_error = function() {
    console.log('error');
};