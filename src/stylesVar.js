var config = {
    'brand-primary': '#0087fa',
    'dark': '#303030',
    'dark-light-slight': '#9c9b97',
    'dark-mid': '#96969b',
    'dark-light': '#dbe0e3',
    'dark-lighter': '#e7eaeb',
    'white': '#ffffff'
}

module.exports = function(key) {
    return config[key];
}
