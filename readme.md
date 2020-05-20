# Angular JWT Tools

<!-- markdownlint-disable MD013 -->

[![CI](https://github.com/AlexAegis/auth/workflows/CI/badge.svg)](https://github.com/AlexAegis/auth/actions?query=workflow%3ALint) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/2b1db44e2d0348f4b81e320cdcb120f8)](https://www.codacy.com/manual/AlexAegis/auth?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/auth&utm_campaign=Badge_Grade) [![codecov](https://codecov.io/gh/AlexAegis/auth/branch/staging/graph/badge.svg)](https://codecov.io/gh/AlexAegis/auth) [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=AlexAegis/auth)](https://dependabot.com) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FAlexAegis%2Fauth.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FAlexAegis%2Fauth?ref=badge_shield)

<!-- markdownlint-enable MD013 -->

```json
{
  "@aegis-auth/core": "^9.0.0"
}
```

## [Core Package](./packages/core)

Core angular package for the common parts. Used for configuration.

## [Token Package](./packages/token)

Abstract token package, must be configured. used by the JWT and CSRF packages.

## [JWT Package](./packages/jwt)

Partially configures the base token package, handles jwt tokens and
interceptors. Automatically refreshes them.

## [CSRF Package](./package/csrf)

Partially configures the base token package, handles csrf tokens and
interceptors.

## [NgRX Package](./package/ngrx)

NgRX plug-and-play store to handle tokens through it.

## [Nest Package](./package/nest)

Nest module that provides some useful stuff on top of @nestjs/jwt such as
cached blacklisting. (Either needs a bridge to a database to store the blacklist
or automatically revoke all the tokens on startup by changing the secret with a
startup-time sensitive salt, like appending the timestamp. This would mean that
after every restart, everybody has to relog. The benefit is that it requires
minimal configuration)

## [Toolbox Package](./packages/toolbox)

Contains the base JWT Interactions, token parsing, data extraction methods.
Can be used on it's own

## Development

Fork the repository, then clone it.

```sh
git clone https://www.github.com/AlexAegis/jwt
```

- asd
- ew
