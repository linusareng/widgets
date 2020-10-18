'use strict';
/**
 * This widget displays the official standings. These usually only change as you cross the start/finish line.
 * The cars are color coded as Red(At least a lap ahead), Blue (At least a lap behind), White (Same lap as you), Cyan (Off track).
 * A blink counter is shown before the Club Name.
 * 
 * Red box around the name indicates below minimum speed. 
 * <p>
 * Example:
 * <p><b>
 * &lt;sra-standings&gt;&lt;/sra-standings&gt;<br />
 * </b>
 * <img src="../widgets/Standings/icon.png" />
 * @ngdoc directive
 * @name sra-LA-Formula1-Standings
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2020 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps', 'css!widgets/LA-Formula1-Standings/LA-Formula1-Standings', 'widgets/CarNumber/CarNumber'],
    function (SIMRacingApps) {

        var self = {
            name: 'sraLA-Formula1-Standings',
            url: 'LA-Formula1-Standings',
            template: 'LA-Formula1-Standings.html',
            defaultWidth: 1600,
            defaultHeight: 2600,
            defaultInterval: 1000, //initialize with the default interval
            module: angular.module('SIMRacingApps') //get the main module
        };

        self.module.directive(self.name,
            ['sraDispatcher',
                function (sraDispatcher) {
                    return {
                        restrict: 'EA',
                        scope: true,
                        templateUrl: sraDispatcher.getWidgetUrl(self.url) + '/' + self.template,
                        controller: ['$scope', function ($scope) {
                            $scope.directiveName = self.name;
                            $scope.defaultWidth = self.defaultWidth;
                            $scope.defaultHeight = self.defaultHeight;
                            $scope.defaultInterval = self.defaultInterval;
                            $scope.sraRelativeCar = "REFERENCE";

                        }]
                        , link: function ($scope, $element, $attrs) {
                            $scope.names = sraDispatcher.subscribe($scope, $attrs, self.defaultInterval); //register subscriptions and options to the dispatcher
                        }
                    };
                }]);

        return self;
    });
