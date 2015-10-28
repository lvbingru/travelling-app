var config = {
    'brand-primary': '#0087fa',
    'dark': '#303030',
    'dark-light': '#96969b',
    'dark-light-slight': '#9c9b97',
    'dark-lighter': '#dbe0e3',
    'white': '#ffffff'
}

module.exports = function(key) {
    return config[key];
}
