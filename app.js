(function(){
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective)
    .constant('MenuListURL', 'https://davids-restaurant.herokuapp.com/menu_items.json')
  ;

  NarrowItDownController.$inject = ['MenuSearchService'];

  function NarrowItDownController(MenuSearchService) {
    var menu        = this;

    menu.found      = [];
    menu.fetched    = false;
    menu.searchTerm = null;

    menu.searchItems = function(){
      var promise     = MenuSearchService.getMatchedMenuItems(menu.searchTerm);

      promise.then(function (result) {
        menu.found    = result.items;
        menu.fetched  = true;
      })
      .catch(function (error) {
        console.log(error.message);
      });
    };

    menu.removeItem = function (itemIndex) {
      menu.found.splice(itemIndex, 1);
    };
  }

  MenuSearchService.$inject = ['$q', '$http', 'MenuListURL'];

  function MenuSearchService($q, $http, MenuListURL) {
    var service = this;

    service.getMatchedMenuItems = function(searchTerm) {
      var deferred = $q.defer();
      var result   = {
        items: [],
        message: ''
      };

      service.getMenuItems()
      .then(function(response) {
        if(response.data)
        {
          if(searchTerm && searchTerm.length) {
            result.items = response.data.menu_items.filter(function(item) {
              // return item.description.indexOf(searchTerm) !== -1;
              // or
              return item.description.search(searchTerm) !== -1;
              // or
              // return (new RegExp(searchTerm, 'i')).test(item.description);
            });
          }

          deferred.resolve(result);
        }
        else
        {
          result.message = 'Response data does not exist';

          deferred.reject(result);
        }
      })
      .catch(function(error) {
        result.message = '__o0o_(.)(.)_o0o__ Houston...we have a problem! Error: ' + error.status + ' ' + error.statusText;

        deferred.reject(result);
      });

      return deferred.promise;
    }

    service.getMenuItems = function() {
      return $http.get(MenuListURL);
    };
  }

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        fetched: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'list',
      bindToController: true
    };

    return ddo;
  }

  function FoundItemsDirectiveController() {
    var list = this;

    list.nothingFound = function() {
      return list.fetched && !list.items.length;
    };
  }
})();
