
(function() {
    window.app = {};

    app.init = function() {
        $(".js-content").html(templates.sample());
        $(".js-content button").click(function() {
            var jsonCommunicator = new sjoh.JsonCommunicator();
            jsonCommunicator.send("/hello").then(function(result) {
                $(".js-result").text(result);
            });
        });
    };
})();