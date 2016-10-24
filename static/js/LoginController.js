
app.controller('LoginController', function ($scope, $auth, $state) {

  $scope.signUp = function () {
    $auth
      .signup({email: $scope.email, password: $scope.password})
      .then(function (response) {
        $auth.setToken(response);
        $state.go('index');
      })
      .catch(function (response) {
				console.log("error response", response);
      })
  };

  $scope.login = function () {
    $auth
      .login({email: $scope.email, password: $scope.password})
      .then(function (response) {
        $auth.setToken(response);
        $state.go('secret');
      })
      .catch(function (response) {
				        
       console.log("error response", response);
								
				
      })
  };

  $scope.auth = function (provider) {
    $auth.authenticate(provider)
      .then(function (response) {
        console.debug("success", response);
				console.log(response.data.name)
				$scope.name=response.data.name
        $state.go('index');
      })
      .catch(function (response) {
        console.debug("catch", response);
      })
  }
});

app.controller('SecretCtrl', function ($scope, $state, $auth, $http) {
  $scope.logout = function () {
    $auth.logout();
    $state.go("home");
  };

  getUserInfo();

  function getUserInfo() {
    $http.get('/user')
      .then(function (response) {
        $scope.user = response.data;
      })
      .catch(function (response) {
        console.log("getUserInfo error", response);
      })
  }
});