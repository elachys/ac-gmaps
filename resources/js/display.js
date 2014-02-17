/*global require, _,AP,AC*/
'use strict';
require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
    },
    paths: {
        ac: 'lib/ac',
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
        backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
        text: '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text.min',
        async: 'lib/async',
        epoxy: 'lib/backbone.epoxy'
    }
});

require([
    'jquery',
    'backbone',
    'ac',
    'views/display/mapView',
    'model/mapModel',
], function($, Backbone, ACjs, MapView, MapModel){

    function init(data){
        var view = new MapView({
            el: $('#container'),
            model: new MapModel(data)
        });
        view.render();
    }

    if(AC.getContext() === 'confluence') {
        init(JSON.parse(AC.getUrlParam('data', true) || '{}'));
    } else {
        window.AP.require(['request'], function(request){
            request({
                url: '/rest/api/2/issue/' + AC.getUrlParam('issueKey') + '/properties/ac-gmaps',
                type: 'GET',
                success: function(content){
                    console.log(content);
                    init(JSON.parse(content).value);
                }
            });
        });
    }

});
