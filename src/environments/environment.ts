/**
 * Production environment (used by `ng build` / the nginx Docker image).
 *
 * apiUrl = the api-gateway base URL. In Docker the gateway is published on
 * host port 8080 (see docker-compose.yml), so this value works for both the
 * dev server and the containerized frontend.
 *
 * TODO(Task 8): the AuthService, HTTP interceptor and guard you add will read
 * this file - keep every backend URL behind `environment.apiUrl`.
 */
export const environment = {
    production: true,
    apiUrl: 'http://localhost:8080'
};
