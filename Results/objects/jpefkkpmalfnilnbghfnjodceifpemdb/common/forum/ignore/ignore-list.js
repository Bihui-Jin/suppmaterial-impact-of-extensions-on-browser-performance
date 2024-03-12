var IgnoreListClass = function() {
    this.ignoreList = {};

    this.maxIgnoredUsersAmount = 150;
    this.currentIgnoredUsersAmount = 0;

    this.ignoreListMaxLength = 18;
    this.commentMaxLength = 30;
    var self = this;

    this.init = function(ignoreList) {
        self.ignoreList = ignoreList;

        self.currentIgnoredUsersAmount = Object.keys(self.ignoreList).length;
    };

    this.addIgnoredUser = function(ignoreName, comment) {
        if (!self._isNameValid(ignoreName) || typeof self.ignoreList[ignoreName] !== 'undefined' || self.currentIgnoredUsersAmount >= self.maxIgnoredUsersAmount) {
            return false;
        }

        if (comment.length > self.commentMaxLength) {
            return false;
        }

        self.currentIgnoredUsersAmount++;
        self.ignoreList[ignoreName] = {'comment': comment};

        kango.invokeAsync('kango.storage.setItem', 'forumIgnore', self.ignoreList);

        return true;
    };

    this._isNameValid = function(ignoreName) {
        return ignoreName.length > 0 && ignoreName.length <= self.ignoreListMaxLength;
    };

    this.removeIgnoredUser = function(ignoreName) {
        delete self.ignoreList[ignoreName];
        self.currentIgnoredUsersAmount--;

        kango.invokeAsync('kango.storage.setItem', 'forumIgnore', self.ignoreList);
    };

    this.getIgnoreList = function() {
        return self.ignoreList;
    };

    this.getMaxIgnoredUsersAmount = function() {
        return self.maxIgnoredUsersAmount;
    };

    this.getCurrentIgnoredUsersAmount = function() {
        return self.currentIgnoredUsersAmount;
    }
}