# Meme Bros

## Project Structure

```
|-- apps
|  |-- mobile
|  |-- canvas
|  |-- web
|  |  |-- admin
|  |  |-- website
|  |-- api
|  |  |-- admin
|  |  |-- public
|-- packages
|  |-- core
|  |-- app
|  |-- api-lib
|  |-- client-lib
```

## Apps

``canvas``

Web-based component for ``app``

``mobile``

Android + iOS integration for ``app``

``api/public``

API accessible by everyone (mainly used by ``app``)

``api/admin``

API protected by credentials (mainly used by ``web/admin``)

``web/website``

Web integration for ``app`` + Landing Page

``web/admin``

Templates-Management using web integration for ``app``

## Packages

``core``

Meme-Generator written in Go

``app``

Shared react-native application

``client-lib``

Shared modules between canvas + mobile

``api-lib``

Shared modules between ``api/public`` + ``api/admin``
