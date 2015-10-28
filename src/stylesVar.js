var config = {
    'brand-primary': '#0087fa',
    'dark': '#303030',
    'dark-light': '#96969b',
    'dark-lighter': '#dbe0e3'
}

module.exports = function(key) {
    return config[key];
}
