/**
 * @ngdoc overview
 * @name viz.charts
 *
 * @description
 * AngularJS version of a Vertical Bar chart using SVG.
 *
 */
angular.module('viz.charts', [])
  .controller('VerticalBarChartController', ['$q', '$http', '$scope', 'vMetaConfig',
    function($q, $http, $scope,vMetaConfig) {
      
      function loadMetaData(url){
        var deferred = $q.defer();
        $http.get(url).success(function(data){
          deferred.resolve(data);
        });
        return deferred.promise;
      }
      
      function getData(url){
        var deferred = $q.defer();
        $http.get(url).success(function(data){
          deferred.resolve(data);
        });
        return deferred.promise;
      }
      
      function calcGraphMeta(){
        var meta = $scope.data.meta;
        var vb = meta.hb;
        var xa = meta.xa;
        var ya = meta.ya;
        meta.yAxisStart = meta.height - meta.yPadding;
        vb.e = []; xa.e = []; ya.e = [];
        var i = 0;
        var maxBar = 0;
        for (var key in $scope.data.rows) {
          if(maxBar < $scope.data.rows[key])
            maxBar = $scope.data.rows[key];
        }
        $scope.data.maxBar = maxBar;
        var convRatio = $scope.data.maxBar / meta.yAxisStart;
        console.log(convRatio);
        for (key in $scope.data.rows) {
          var barStart = meta.xPadding + (meta.barPadding * i++)
          var dataPoint = $scope.data.rows[key];
          if($scope.data.rows[key] < 0) dataPoint = 0;
          vb.e.push({
            h: dataPoint/convRatio,
            x: barStart
          });
          xa.e.push({
            e: key,
            x: barStart
          });
        }
        
        var ySplit = meta.ya.splits;
        var yAxisUnits = parseInt($scope.data.maxBar/ySplit,10);
        var yAxisUnitHeight = parseInt(meta.yAxisStart / ySplit, 10);
        for (i = 0; i <= ySplit; i++) {
          var yPosition = meta.yAxisStart - (yAxisUnitHeight*i);
          if(yPosition < 0) yPosition = 0;
          ya.e.push({
            e: (yAxisUnits * i),
            y: yPosition
          });
        }
      }
      
      function loadGraph(){
        loadMetaData('./vChartMeta.json').then(function(meta){//Move this out
          //$scope.vMeta = meta;
          getData('./vChartData.json').then(function(data){//Move this out
            $scope.data = data;
            $scope.data.meta = vMetaConfig;
            calcGraphMeta();
          });
        });
      }
      
      loadGraph();
      
      // for(var i=0;i<100;i++){
      //   var xVal = Math.floor(Math.random() * (max - min)) + min;
      //   //$scope.data.rows.
      // }
      
      $scope.addHits = function(val) {
        $scope.data.rows[val] += 40;
        calcGraphMeta();
      };
      $scope.subHits = function(val) {
        $scope.data.rows[val] -= 40;
        calcGraphMeta();
      };

    }
  ])
  .constant('vMetaConfig',{
    "width": 700,
    "height": 400,
    "yPadding": 40,
    "xPadding":25,
    "barPadding":40,
    "ya": {
      "splits": 10,
      "lineWidth": 1,
      "e": []
    },
    "xa": {
      "lineWidth": 1,
      "e": []
    },
    "hBarWidth": 30,
    "hb": {
      "e": []
    }
})

.directive('vBarChart', function(){
  return {
    restrict: 'EA',
    controller: 'VerticalBarChartController',
    templateNamespace: 'svg',
    templateUrl: 'chart.html'
  }
})

.directive('xaxisElements', function() {
  return {
    restrict: 'A',
    controller: 'VerticalBarChartController',
    require: '^vBarChart',
    templateNamespace: 'svg',
    templateUrl: 'xaxis.html'
  };
})

.directive('yAxisElements', function() {
  return {
    restrict: 'A',
    controller: 'VerticalBarChartController',
    require: '^vBarChart',
    templateNamespace: 'svg',
    templateUrl: 'yaxis.html'
  };
})

.directive('vbar', function() {
  return {
    restrict: 'A',
    controller: 'VerticalBarChartController',
    require: '^vBarChart',
    templateNamespace: 'svg',
    templateUrl: 'bar.html'
  }
});