angular.module('gunAndRunApp.services', [])

angular.module('gunAndRunApp.services').constant('StringResources', {
    rus: {
        nameInputLabel: 'Имя',
        countryInputLabel: 'Страна',
        cityInputLabel: 'Город',
        loginButtonText: 'Войти',

        loginExistsErrorText: 'Имя уже занято'
    },
    eng: {
        nameInputLabel: 'Name',
        countryInputLabel: 'Country',
        cityInputLabel: 'City',
        loginButtonText: 'Login',

        loginExistsErrorText: 'Login name is already exists'
    }
});
