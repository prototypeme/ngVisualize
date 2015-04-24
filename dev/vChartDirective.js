/**
* @ngdoc overview
* @name viz.charts
*
* @description
* AngularJS version of a Vertical Bar chart using SVG.
*
*/
angular.module('viz.charts', [])
.controller('vChartController',['$scope', function($scope){
  $scope.data = {
    title: 'Weekly Report',
    xAxisTitle: 'Users',
    yAxisTitle: 'Day of week',
    xAxisUnit: '',
    rows: 
      {'Sun':200,'Mon':20, 'Tue':40, 'Wed':60, 'Thu':80, 'Fri':100,'Sat':220}
    
  };
  
  $scope.vMeta = {
    width: 960,
    height: 500,
    ya: {title: '% to Total', lineWidth: 1, e: [] },
    xa: {title: '', lineWidth: 1, e: [] },
    hBarWidth: 31,
    hb: { e: [] }
  };
  
  function genYAxis(ya){
    ya.e = [];
    for(var i=0;i<=10;i++){
      ya.e.push({e:i+'%',y:450-(40*i)});
    }
  }
  genYAxis($scope.vMeta.ya);
  
  function genXAxis(xa, data){
    xa.e = [];
    var i = 0;
    for(var key in data.rows){
      xa.e.push({e:key,x:20+(65*i++)});
    }
    
  }
  genXAxis($scope.vMeta.xa, $scope.data);
  
  $scope.hbElements = [];
  function genHBarElements(hb, data){
    hb.e = [];
    var i=0;
    for(var key in data.rows){
      hb.e.push({h: data.rows[key], x:20+(65*i++)});
    }
  }
  genHBarElements($scope.vMeta.hb, $scope.data);
  
  $scope.addHits = function(val){
    $scope.data.rows[val] = $scope.data.rows[val] + 10;
    genHBarElements($scope.vMeta.hb, $scope.data);
  };
  
  $scope.subHits = function(val){
    $scope.data.rows[val] = $scope.data.rows[val] - 10;
    genHBarElements($scope.vMeta.hb, $scope.data);
  };
  
}])
.directive('xaxisElements',function(){
  return {
    restrict: 'A',
    templateNamespace: 'svg',
    template: '<g ng-attr-transform="translate({{xe.x}},460)" ng-repeat="xe in vMeta.xa.e">'
+'<line y2="6" x2="0"></line>'
+'<text dy=".71em" y="9" x="0" style="text-anchor: middle;">{{xe.e}}</text></g>'
  };
})
.directive('yAxisElements',function(){
  return {
    restrict: 'A',
    templateNamespace: 'svg',
    template: '<g ng-repeat="ye in vMeta.ya.e" ng-attr-transform="translate(0,{{ye.y}})">'
    +'<line x2="-6" y2="0"></line><text dy=".32em" x="-9" y="0" style="text-anchor: end;">{{ye.e}}</text></g>'
    +'<text transform="rotate(-90)" y="6" style="text-anchor: end;">{{vMeta.ya.title}}</text>'
  };
})
.directive('hbar',function(){
  return{
    restrict: 'A',
    templateNamespace: 'svg',
    template: '<rect ng-repeat="hb in vMeta.hb.e" class="bar" ng-attr-x="{{hb.x-15}}" '
    +'ng-attr-width="{{vMeta.hBarWidth}}" ng-attr-y="{{vMeta.height - hb.h - 45}}" ng-attr-height="{{hb.h}}"></rect>'
  }
})
;