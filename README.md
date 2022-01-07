# Meme Bros

## Project Structure

```
|-- app
|-- canvas
|-- core
|-- mobile
|-- shared
|-- web
|   |-- website
|   |-- admin
|-- api
|   |-- admin
|   |-- public
```

## Packages

``app``

Shared react-native application

``canvas``

Web-based component for ``app``

``mobile``

Android + iOS integration for ``app``

``web/website``

Web integration for ``app`` + Landing Page

``web/admin``

Templates-Management using web integration for ``app``

``api/public``

API accessible by everyone (mainly used by ``app``)

``api/admin``

API protected by credentials (mainly used by ``web/admin``)
