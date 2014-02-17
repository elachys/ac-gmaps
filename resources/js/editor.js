/*global require, _,AP, AC*/
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
        epoxy: {
            deps: [
                'backbone'
            ]
        }
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
    'views/editor/editorView',
    'model/mapModel'
], function($, Backbone, ACjs, EditorView, MapModel){
    //create a pubsub event system for global notifications
    Backbone.Notifications = {};
    _.extend(Backbone.Notifications, Backbone.Events);

    var map, data;
    window.AP.require('confluence', function(confluence){
        confluence.getMacroData(function(data){
            alert(document.cookie);
            console.log("THE DATA IN MY PLUGIN", data);
        });
    });
    if(AC.getContext() === 'confluence') {
        init(AC.getUrlParam('data', true))
    } else {
        AP.require('request', function(request){
            request({
                url: '/rest/api/2/issue/' + AC.getUrlParam('issueKey') + '/properties/ac-gmaps',
                type: 'GET',
                success: function(content){
                    console.log(content);
                    //now pickout the correct content.
                    init(JSON.parse(content).value);
                }
            });
        });
    }

    function init(data){
        if(data){
            data = JSON.parse(data);
        } else {
            data = {};
        }

        window.mapModel = new MapModel(data);

        var view = new EditorView({
            el: $('#container'),
            model: window.mapModel
        }).render();
    }

});

window.AP.require(["confluence", "dialog", "request"], function (confluence, dialog, request) {
    dialog.getButton("submit").bind(function() {
        if(AC.getContext() === 'confluence'){
            confluence.saveMacro({data: JSON.stringify(window.mapModel)});
        } else {
            request({
                url: '/rest/api/2/issue/' + AC.getUrlParam('issueKey') + '/properties/ac-gmaps',
                type: 'PUT',
                data: {
                    data: JSON.stringify(window.mapModel)
                },
                contentType: 'application/json'
            });
        }
        return true;
    });
});
