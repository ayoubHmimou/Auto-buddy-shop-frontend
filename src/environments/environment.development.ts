/**
 * Development environment - swapped in automatically by the `development`
 * build configuration (see fileReplacements in angular.json).
 *
 * Same gateway URL as production: the api-gateway always listens on
 * localhost:8080 in the dev loop.
 */
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080'
};
