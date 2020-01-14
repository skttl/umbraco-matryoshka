angular.module('umbraco.services').config([
    '$httpProvider',
    function ($httpProvider) {

        $httpProvider.interceptors.push(function ($q) {
            return {
                'response': function (response) {

                    if (response.config.url.includes("views/content/apps/content/content.html")) {
                        response.data = response.data.replace("umb-tabbed-content", "matryoshka-tabbed-content");
                    }

                    return response;
                }
            };
        });

    }]);