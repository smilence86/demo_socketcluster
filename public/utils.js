let utils = {};

utils.names = ['灭霸', '屎大颗', '雷神', '奥创', '黑寡妇', 'Doctor Strange'];

utils.randomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}