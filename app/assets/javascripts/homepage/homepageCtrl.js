angular.module('hockeyPool')
.controller('HomepageCtrl', ['entries', function(entries) {
    var vm = this;
    vm.isOpen = [];
    vm.showingAll = false;
    
    vm.showAll = function(show) {
        for (var j = 0; j < entries.length; j++) {
            vm.isOpen[j] = show;
        }
        vm.showingAll = show;
    };
    
    function calculatePoints() {
        entries.forEach(function(entry) {
            entry.points = 0;
            entry.pointsC = 0;
            entry.pointsW = 0;
            entry.pointsD = 0;
            entry.pointsG = 0;
            entry.totalGoals = 0;
        });
    }
    
    function sortEntries() {
        entries.sort(function(a, b) {
            if (b.points - a.points === 0) {
                if (!a.tiebreaker || (a.tiebreaker && a.tiebreaker !== 'W' && a.tiebreaker !== 'D' && a.tiebreaker !== 'G' && a.tiebreaker !== 'Goals' && a.tiebreaker !== 'Tied')) { a.tiebreaker = 'C'; }
                if (!b.tiebreaker || (b.tiebreaker && b.tiebreaker !== 'W' && b.tiebreaker !== 'D' && b.tiebreaker !== 'G' && b.tiebreaker !== 'Goals' && b.tiebreaker !== 'Tied')) { b.tiebreaker = 'C'; }
                if (b.pointsC - a.pointsC === 0) {
                    if (a.tiebreaker !== 'D' && a.tiebreaker !== 'G' && a.tiebreaker !== 'Goals' && a.tiebreaker !== 'Tied') { a.tiebreaker = 'W'; }
                    if (b.tiebreaker !== 'D' && b.tiebreaker !== 'G' && b.tiebreaker !== 'Goals' && b.tiebreaker !== 'Tied') { b.tiebreaker = 'W'; }
                    if (b.pointsW - a.pointsW === 0) {
                        if (a.tiebreaker !== 'G' && a.tiebreaker !== 'Goals' && a.tiebreaker !== 'Tied') { a.tiebreaker = 'D'; }
                        if (b.tiebreaker !== 'G' && b.tiebreaker !== 'Goals' && b.tiebreaker !== 'Tied') { b.tiebreaker = 'D'; }
                        if (b.pointsD - a.pointsD === 0) {
                            if (a.tiebreaker !== 'Goals' && a.tiebreaker !== 'Tied') { a.tiebreaker = 'G'; }
                            if (b.tiebreaker !== 'Goals' && b.tiebreaker !== 'Tied') { b.tiebreaker = 'G'; }
                            if (b.pointsG - a.pointsG === 0) {
                                if (a.tiebreaker !== 'Tied') { a.tiebreaker = 'Goals'; }
                                if (b.tiebreaker !== 'Tied') { b.tiebreaker = 'Goals'; }
                                if (b.totalGoals - a.totalGoals === 0) {
                                    a.tiebreaker = 'Tied';
                                    b.tiebreaker = 'Tied';
                                }
                                return b.totalGoals - a.totalGoals;
                            } else {
                                return b.pointsG - a.pointsG;
                            }
                        } else {
                            return b.pointsD - a.pointsD;
                        }
                    } else {
                        return b.pointsW - a.pointsW;
                    }
                } else {
                    return b.pointsC - a.pointsC;
                }
            } else {
                return b.points - a.points;
            }
        });
        
        for(var i = 0; i < entries.length; i++) {
            if (i === 0) {
                entries[i].rank = 1;
                continue;
            }
            if (!entries[i].tiebreaker || entries[i].tiebreaker !== 'Tied') {
                entries[i].rank = i + 1;
                continue;
            }
            if (entries[i].points === entries[i-1].points && 
                entries[i].pointsC === entries[i-1].pointsC && 
                entries[i].pointsW === entries[i-1].pointsW && 
                entries[i].pointsD === entries[i-1].pointsD &&
                entries[i].pointsG === entries[i-1].pointsG &&
                entries[i].totalGoals === entries[i-1].totalGoals) {
                    entries[i].rank = entries[i-1].rank;
            } else {
                entries[i].rank = i + 1;
            }
        }
    }
    
    function init() {
        vm.showAll(false);
        calculatePoints();
        sortEntries();
        vm.entries = entries;
    }
    
    init();
}]);