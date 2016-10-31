(function ( ) {
    "use strict";
    var assignmentsApp = angular.module("assignmentsApp", []);

    assignmentsApp
      .controller("ToBuyController",  ToBuyController)
      .controller("BoughtController", BoughtController)
      .service("ShoppingListService", ShoppingListService);

    ToBuyController.$inject = ["ShoppingListService"];
    BoughtController.$inject = ["ShoppingListService"];

    function ShoppingListService(){
      var shoppingListService = this;
      shoppingListService.itemsToBuy = [
        {name: 'Cookies', quantity: 100},
        {name: 'Chips', quantity: 30},
        {name: 'Sugary Drinks', quantity: 5},
        {name: 'Candy', quantity: 50},
        {name: 'Tomatos', quantity: 5}
      ];

      shoppingListService.itemsBought = [];

      this.getItemsToBuy = function(){
        return shoppingListService.itemsToBuy;
      };

      this.getItemsBought = function(){
        return shoppingListService.itemsBought;
      };

      shoppingListService.moveItemtoBoughtList = function ( itemIndex ){
        shoppingListService.itemsBought.push(shoppingListService.itemsToBuy[itemIndex]);
        shoppingListService.itemsToBuy = shoppingListService.itemsToBuy.slice(0,itemIndex).concat(shoppingListService.itemsToBuy.slice(itemIndex + 1));
      }
    }

    function ToBuyController( ShoppingListService) {
      var toBuyCtrl = this;
      toBuyCtrl.getItemsToBuy = ShoppingListService.getItemsToBuy();
      this.moveItemtoBoughtList = function( itemIndex ){
        ShoppingListService.moveItemtoBoughtList( itemIndex );
        toBuyCtrl.getItemsToBuy = ShoppingListService.getItemsToBuy();
      };
    }

    function BoughtController( ShoppingListService ){
      this.getItemsBought = ShoppingListService.getItemsBought();
    }

})();
