var IgnoreToolsClass = function(ignoreList) {
    this.ignoreList = ignoreList;
    this.ignoreNicks = {};

    this.presets = {
        "gusid": {
            name: "Гусид",
            img: "res/gusid.png",
            comment: "Gusatrix has you!"
        },
        "invis": {
            name: "Анонимус",
            img: "res/invis.png",
            comment: " "
        },
        "glad": {
            name: "Гладиатор-ветеран",
            img: "res/glad.png",
            comment: "Мне нечего вам сказать."
        },
        "sasha": {
            name: "Саша",
            img: "res/sasha.png",
            comment: "Привет ;)"
        },
        "fisher": {
            name: "Рыбак",
            img: "res/fisher.png",
            comment: "Рыбка соскочила... ;)"
        },
        "miner": {
            name: "Шахтер",
            img: "res/miner.png",
            comment: "Среди добытого полезных материалов не обнаружено"
        }
    };

    var self = this;

    this.init = function() {
        this.loadNicks();

        return self;
    }

    this.isIgnored = function(nick) {
        if (typeof self.ignoreNicks[nick.toUpperCase()] == 'undefined') {
            return false;
        }

        return true;
    }

    this.loadNicks = function() {
        for (i in self.ignoreList) {
            self.ignoreNicks[i.toUpperCase()] = true;
        }
    }

    this.getPreset = function(presetName) {
        if (typeof self.presets[presetName] == 'undefined') {
            return self.presets['gusid'];
        }

        return self.presets[presetName];
    }
}
