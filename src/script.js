(function(){
	var shadowSlider = angular.module('shadowSlider', ['colorpicker.module'])
	
	.service("utils", function() {
	
		var createBoxShadowString = function(s) {
			return (s.inset ? 'inset ' : '') + s.x + 'px ' + s.y + 'px ' + s.blur + 'px ' + s.spread + 'px ' + s.color;
		}
	
		this.computeStyle = function(attributes) {
			var str = "";
			if (!attributes.disabled){
				str += "box-shadow: ";
				str += createBoxShadowString(attributes);
			}
			return str;
		}
	})
	
	.directive("boxslider", function(utils) {
		return {
			require : '^id',
			scope : {
				id : '@',
				boxShadow : '='
			},
			controller : function($scope) {
				$scope.attrs = {};
				
				$scope.reset = function() {
					$scope.attrs.x = 0;
					$scope.attrs.y = 0.5;
					$scope.attrs.spread = 1;
					$scope.attrs.color = "black";
					$scope.attrs.inset = false;
					$scope.attrs.blur = 0;
					$scope.attrs.disabled = false;
				}
				
				$scope.toggleDisable = function() {
					$scope.attrs.disabled = !$scope.attrs.disabled;
				}
				
				$scope.$watch("attrs", function(nv, ov) {
					$scope.boxShadow.shadow = utils.computeStyle(nv);
					console.log($scope.boxShadow);
				}, true);
				
				$scope.reset();
				
			},
			restrict : 'EA',
			templateUrl : "sliders.html",
			replace : false,
		}
	});
})();

var app = angular.module("myApp", ['shadowSlider']);

app.controller("sliderController", function($scope) {
	
	$scope.shadows = [];
	
	$scope.boxShadowStyle = "";

	$scope.addShadow = function() {
		$scope.shadows.push({
			shadow: ""
		})
	}

	$scope.removeShadow = function(index) {
		//TODO refactor
		$scope.shadows.splice(index, 1);
	}
	$scope.$watch("shadows", function(nv, ov) {
		$scope.boxShadowStyle = calcShadowStyle();
	}, true);
	
	function calcShadowStyle() {
		var str = "box-shadow: ";
		var activeShadowIndex = 0;
		for (var i = 0; i < $scope.shadows.length; i++){
			var shadow = $scope.shadows[i].shadow;
			if (shadow && shadow != ""){
				if (activeShadowIndex !=0){
					str += ", ";
				}
				str += shadow.split("box-shadow:")[1];
				activeShadowIndex ++;
			}
		}
		str += ";";
		return str;
	}
});
