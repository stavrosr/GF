var GFApp = angular.module('GFApp', []);

function Card(v) { 
    this.Value = v;
}
Card.prototype.toString = function () {
    return this.Value;
}

GFApp.controller('GFCtrl', function ($scope, $timeout) {
    $scope.Deck = [
        new Card("1"),
        new Card("2"),
        new Card("3"),
        new Card("4"),
        new Card("5"),
        new Card("6"),
        new Card("7"),
        new Card("8"),
        new Card("9"),
        new Card("10"),
        new Card("1"),
        new Card("2"),
        new Card("3"),
        new Card("4"),
        new Card("5"),
        new Card("6"),
        new Card("7"),
        new Card("8"),
        new Card("9"),
        new Card("10"),
        new Card("1"),
        new Card("2"),
        new Card("3"),
        new Card("4"),
        new Card("5"),
        new Card("6"),
        new Card("7"),
        new Card("8"),
        new Card("9"),
        new Card("10"),
        new Card("1"),
        new Card("2"),
        new Card("3"),
        new Card("4"),
        new Card("5"),
        new Card("6"),
        new Card("7"),
        new Card("8"),
        new Card("9"),
        new Card("10")
    ];
    $scope.PlayerHand = [];
    $scope.PlayerBooks = [];
    $scope.ComputerHand = [];
    $scope.ComputerBooks = [];
    $scope.Message = "";
    $scope.Turn = "";
    $scope.Page = "Home";
    $scope.Debug = true;

    $scope.Play = function () {
        //Return all cards back to the deck
        var PlayerHandCount = $scope.PlayerHand.length;
        for (var i = 0; i < PlayerHandCount; i++) {
            $scope.Deck.push($scope.PlayerHand[0]);
        }
        var ComputerHandCount = $scope.ComputerHand.length;
        for (var i = 0; i < ComputerHandCount; i++) {
            $scope.Deck.push($scope.ComputerHand[0]);
        }

        //Shuffle the deck
        $scope.Deck.sort(function (a, b) { return 0.5 - Math.random(); });

        //Deal the cards
        for (var i = 0; i < 7; i++) {
            $scope.PlayerHand.push($scope.Deck.pop());
            $scope.ComputerHand.push($scope.Deck.pop());
        }

        //Sort the hands
        $scope.PlayerHand.sort($scope.SortHand);
        $scope.ComputerHand.sort($scope.SortHand);
        $scope.Page = "GameOn";
        $scope.Turn = "Player";
    };

    $scope.AskFor = function (val) {
        if ($scope.Debug) {
            console.log("Player's Hand: " + $scope.PlayerHand);
            console.log("Computer's Hand: " + $scope.ComputerHand);
            console.log($scope.Turn + " asked for " + val);
        }

        var CardsToHandOver = [];
        var FromHand, ToHand;
        if ($scope.Turn === "Player") {
            FromHand = $scope.ComputerHand;
            ToHand = $scope.PlayerHand;
        } else {
            FromHand = $scope.PlayerHand;
            ToHand = $scope.ComputerHand;
        }

        //Look through hand
        for (var i = 0; i < FromHand.length; i++) {
            if (FromHand[i].Value === val) {
                CardsToHandOver.push(i);
            }
        }

        if (CardsToHandOver.length > 0) {
            var DiscardOffset = 0;
            for (var i = 0; i < CardsToHandOver.length; i++) {
                ToHand.push(FromHand.splice(CardsToHandOver[i] - DiscardOffset, 1)[0]);
                DiscardOffset += 1;
            }
            ToHand.sort($scope.SortHand);
            $scope.Message = "Here you go";
        } else {
            $scope.Message = "Go Fish";
            ToHand.push($scope.Deck.pop());
            ToHand.sort($scope.SortHand);
        }

        if ($scope.Turn === "Player") {
            $timeout(function () {
                $scope.ComputersTurn();
            }, 1000);
        }
    };

    $scope.ComputersTurn = function () {
        $scope.Turn = "Computer";
        var LookingFor = $scope.EvaluateChoices();
        $scope.Message = "Got any " + LookingFor + "'s?";
        $timeout(function () {
            $scope.AskFor(LookingFor);
            $scope.Turn = "Player";
        }, 1000);
    };

    $scope.EvaluateChoices = function () {
        if (Math.floor(Math.random() * 3) === 0) {
            var BestOption = "";
            var BestOptionCount = 0;
            var CurrentOption = "";
            var CurrentOptionCount = 0;
            for (var i = 0; i < $scope.ComputerHand.length; i++) {
                if ($scope.ComputerHand[i].Value !== CurrentOption) {
                    if ((CurrentOptionCount > BestOptionCount) && (CurrentOptionCount < 4)) {
                        BestOption = CurrentOption;
                        BestOptionCount = CurrentOptionCount;
                    }
                    CurrentOption = $scope.ComputerHand[i].Value;
                    CurrentOptionCount = 0;
                }
                CurrentOptionCount += 1;
            }
            return BestOption;
        } else {
            return $scope.ComputerHand[Math.floor(Math.random() * $scope.ComputerHand.length)].Value;
        }
    };

    $scope.SortHand = function (a, b) {
        return a.Value - b.Value;
    };
});