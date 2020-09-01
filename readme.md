# Angular Authentication Tools

<!-- markdownlint-disable MD013 -->

[![Latest NPM Version](https://img.shields.io/npm/v/@aegis-auth/jwt/latest)](https://www.npmjs.com/package/@aegis-auth/jwt) [![CI](https://github.com/AlexAegis/auth/workflows/CI/badge.svg)](https://github.com/AlexAegis/auth/actions?query=workflow%3ALint) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/2b1db44e2d0348f4b81e320cdcb120f8)](https://www.codacy.com/manual/AlexAegis/auth?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/auth&utm_campaign=Badge_Grade) [![codecov](https://codecov.io/gh/AlexAegis/auth/branch/staging/graph/badge.svg)](https://codecov.io/gh/AlexAegis/auth) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=AlexAegis/auth)](https://dependabot.com) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FAlexAegis%2Fauth.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FAlexAegis%2Fauth?ref=badge_shield)

<!-- markdownlint-enable MD013 -->

## Backport Branch for Angular 8

This branch is responsible for the `8.x.x` versions and Angular 8 support.

Angular 8 will be in LTS until Nov 28, 2020. After that this series wont get
any new releases, please upgrade to a newer Angular version.

See the individual packages for more information

## [JWT Package](./libs/jwt)

> For information on how to use it, visit the link above!

```json
{
  "@aegis-auth/jwt": "^8.0.0"
}
```

Handles common JWT use-cases, like adding the access token to
requests **and automatically refreshing it when needed**.

It consists of a `JwtModule` with two configurable Interceptors, and a helper
service to access your parsed and typed tokens.

It also provides a way to handle cases where a refresh cannot happen
(For example: both token expired) with a redirection (As thats the most
common recovery method) or a completely custom function for more advanced
use-cases.
