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
 * @name sra-standings
 * @param {integer} data-sra-args-interval The interval, in milliseconds, that this widget will update from the server. Default is 1000.
 * @author Jeffrey Gilliam
 * @since 1.0
 * @copyright Copyright (C) 2015 - 2020 Jeffrey Gilliam
 * @license Apache License 2.0
 */
define(['SIMRacingApps', 'css!widgets/LAstandings/LAstandings', 'widgets/CarNumber/CarNumber'],
    function (SIMRacingApps) {

        var self = {
            name: 'sraLAstandings',
            url: 'LAstandings',
            template: 'LAstandings.html',
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

                            // start flag edits
                            $scope.sessionType = '';
                            $scope.CAUTIONBLINKDURATION = 6000;
                            $scope.timeStarted = 0;
                            $scope.blink = false;
                            $scope.update = function() {
                                var value = $scope.data.Session.Messages.Value + "" + $scope.data.Car.REFERENCE.Messages.Value;
                                var flags = [];
                                $scope.blink = false;

                                //process the flag in importance order. Only the first 2 will get displayed.
                                if ($scope.data.Session.IsRedFlag.Value) {
                                    flags.push("red");
                                }
                                if ($scope.data.Car.REFERENCE.IsBlackFlag.Value) {
                                    flags.push("black");
                                }
                                if ($scope.data.Car.REFERENCE.IsBlueFlag.Value) {
                                    flags.push("blue");
                                }
                                if ($scope.data.Session.IsGreenFlag.Value) {
                                    flags.push("green");
                                }
                                if ($scope.data.Session.IsWhiteFlag.Value) {
                                    flags.push("white");
                                }
                                if ($scope.data.Session.IsCheckeredFlag.Value) {
                                    flags.push("checkered");
                                }
                                if ($scope.data.Session.IsCautionFlag.Value || $scope.data.Car.REFERENCE.IsYellowFlag.Value) {
                                    flags.push("yellow");
                                    if ($scope.timeStarted == 0)
                                        $scope.timeStarted = Date.now();
                                        
                                    if (Date.now() < ($scope.timeStarted + $scope.CAUTIONBLINKDURATION))
                                        $scope.blink = true;
                                }
                                else {
                                    $scope.timeStarted = 0;
                                }
                                if ($scope.data.Session.IsCrossedFlag.Value) {
                                    //TODO: Find a picture of a crossed flag
                                }
                                if (value.indexOf(";REPAIR;") != -1) {
                                    flags.push("repair");
                                }
                                
                                if (flags.length > 0) {
                                    if ($scope.displayLeft)
                                        $scope.image  = "la-flag-" +flags[0];
                                    else {
                                        if (flags.length > 1)
                                            $scope.image = "la-flag-"+flags[1];
                                        else
                                            $scope.image = "la-flag-"+flags[0];
                                    }
                                }
                                else {
                                    //if no flag, then display green, if it has already been displayed
                                    if ($scope.displayGreen && $scope.data.Session.Status.Value == "GREEN") {
                                        if ($scope.displayLeft)
                                            $scope.image  = "SIMRacingApps-Widget-FlagsBar-image-left SIMRacingApps-Widget-FlagsBar-left-green";
                                        else
                                            $scope.image  = "SIMRacingApps-Widget-FlagsBar-image-right SIMRacingApps-Widget-FlagsBar-right-green";
                                    }
                                    else {
                                        //turn off flags
                                        if ($scope.displayLeft)
                                            $scope.image  = "la-no-flag";
                                        else
                                            $scope.image  = "la-no-flag";
                                    }
                                }

                                if ($scope.blink) {
                                    if ($scope._blink == null) {
                                        $scope._blink = $interval(function() {
                                            if ($scope.flagsVisibility == 'inherit') {
                                                $scope.flagsVisibility = 'hidden';
                                            }
                                            else {
                                                $scope.flagsVisibility = 'inherit';
                                            }
                                        }, 500);
                                        //stop the blinking after the CAUTIONBLINKDURATION
                                        $timeout(function() {
                                            if ($scope._blink) {
                                                $interval.cancel($scope._blink);
                                                $scope.flagsVisibility = 'inherit';
                                                $scope._blink = null;
                                                $scope.blink = false;
                                            }
                                        },$scope.CAUTIONBLINKDURATION);
                                    }
                                }
                                else
                                if ($scope._blink) {
                                    $interval.cancel($scope._blink);
                                    $scope.flagsVisibility = 'inherit';
                                    $scope._blink = null;
                                }
                            }
                            // end flag edits

                            //load translations
                            sraDispatcher.loadTranslations(sraDispatcher.getWidgetUrl(self.url), 'text', function (path) {
                            $scope.translations = sraDispatcher.getTranslation(path);
                            });
                        }]
                        , link: function ($scope, $element, $attrs) {

                            // start flag edits
                            /** your code goes here **/
                            $attrs.sraArgsData += ";Session/Type";
                            $attrs.sraArgsData += ";Session/Status";
                            $attrs.sraArgsData += ";Session/Messages";
                            $attrs.sraArgsData += ";Session/IsGreenFlag";
                            $attrs.sraArgsData += ";Session/IsCautionFlag";
                            $attrs.sraArgsData += ";Session/IsRedFlag";
                            $attrs.sraArgsData += ";Session/IsWhiteFlag";
                            $attrs.sraArgsData += ";Session/IsCheckeredFlag";
                            $attrs.sraArgsData += ";Session/IsCrossedFlag";
                            
                            $attrs.sraArgsData += ";Car/REFERENCE/Messages";
                            $attrs.sraArgsData += ";Car/REFERENCE/IsYellowFlag";
                            $attrs.sraArgsData += ";Car/REFERENCE/IsBlueFlag";
                            $attrs.sraArgsData += ";Car/REFERENCE/IsBlackFlag";
                            $attrs.sraArgsData += ";Car/REFERENCE/IsDisqualifyFlag";

                            $scope.$watch("data.Session.Type.Value", $scope.update);
                            $scope.$watch("data.Session.Status.Value", $scope.update);
                            $scope.$watch("data.Session.Messages.Value", $scope.update);
                            $scope.$watch("data.Session.IsGreenFlag.Value", $scope.update);
                            $scope.$watch("data.Session.IsCautionFlag.Value", $scope.update);
                            $scope.$watch("data.Session.IsRedFlag.Value", $scope.update);
                            $scope.$watch("data.Session.IsWhiteFlag.Value", $scope.update);
                            $scope.$watch("data.Session.IsCheckeredFlag.Value", $scope.update);
                            $scope.$watch("data.Session.IsCrossedFlag.Value", $scope.update);
                            $scope.$watch("data.Car.REFERENCE.Messages.Value", $scope.update);
                            $scope.$watch("data.Car.REFERENCE.IsYellowFlag.Value", $scope.update);
                            $scope.$watch("data.Car.REFERENCE.IsBlueFlag.Value", $scope.update);
                            $scope.$watch("data.Car.REFERENCE.IsBlackFlag.Value", $scope.update);
                            $scope.$watch("data.Car.REFERENCE.IsDisqualifyFlag.Value", $scope.update);
                            // end flag edits

                            $scope.names = sraDispatcher.subscribe($scope, $attrs, self.defaultInterval); //register subscriptions and options to the dispatcher
                        }
                    };
                }]);

        return self;
    });
