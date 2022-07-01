# Angular Authentication Tools

[![Latest NPM Version](https://img.shields.io/npm/v/@aegis-auth/jwt/latest)](https://www.npmjs.com/package/@aegis-auth/jwt)
[![CI](https://github.com/AlexAegis/auth/workflows/CI/badge.svg)](https://github.com/AlexAegis/auth/actions?query=workflow%3ALint)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/afdb13d37e7646e0a5fd2c811ec17be1)](https://www.codacy.com/gh/AlexAegis/auth/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/auth&utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/gh/AlexAegis/auth/branch/staging/graph/badge.svg)](https://codecov.io/gh/AlexAegis/auth)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FAlexAegis%2Fauth.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FAlexAegis%2Fauth?ref=badge_shield)

See the individual packages for more information

## [JWT Package](./libs/jwt)

> For information on how to use it, visit the link above!

```json
{
  "@aegis-auth/jwt": "^14.0.0"
}
```

Handles common JWT use-cases, like adding the access token to
requests **and automatically refreshing it when needed**.

It consists of a `JwtModule` with two configurable Interceptors, a
LoginGuard which can also refresh on navigation, and a helper
service to access your parsed and typed tokens.

It also provides a way to handle cases where a refresh cannot happen
(For example: both token expired) with a redirection (As thats the most
common recovery method) or a completely custom function for more advanced
use-cases. It does so both on http requests and on navigation where the
LoginGuard is utilized (And is enabled)

## Requirements

### Node

Use the latest LTS version

### Cypress

To run Cypress e2e tests on a WSL2 Ubuntu instance install the following
dependencies:

```sh
apt install -y xvfb libgtk-3-0 libgbm-dev
```

## Angular

> [Compatibility Matrix](https://gist.github.com/LayZeeDK/c822cc812f75bb07b7c55d07ba2719b3)
