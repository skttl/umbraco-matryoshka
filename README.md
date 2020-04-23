# Matryoshka

[![Our Umbraco project page](https://img.shields.io/badge/our-umbraco-orange.svg)](https://our.umbraco.org/projects/backoffice-extensions/matryoshka)


Matryoshka enables you to layer your document type properties in tabs and groups. It substitutes the content editor view, with its own view, to make existing groups appear as tabs, and adds a property editor, which gives the impression of groups.


## Getting Started

### Installation

> *Note:* Matryoshka has been developed against **Umbraco v8.4.0** and will support that version and above. It should work in v.8.0 and above too though.

Matryoshka can be installed from the Our Umbraco package repository or with NuGet.

#### Our Umbraco Package Repository

To install from Our Umbraco, please download the package from:

> [https://our.umbraco.org/projects/backoffice-extensions/matryoshka](https://our.umbraco.org/projects/backoffice-extensions/matryoshka)

#### NuGet

To install with NuGet, please search NuGet for "[Our.Umbraco.Matryoshka](https://www.nuget.org/packages/Our.Umbraco.Matryoshka)", or install it with this command from the package manager console:

    Install-Package Our.Umbraco.Matryoshka

## Developers Guide

When installed, Matryoshka will change all your existing groups, to be shown as tabs. You can't switch between tabs/groups.

For faux group separations. You can add a datatype using the Matryoshka Group Separator property editor included in the package. When used, the separator will display the property name and description as a headline for your new faux group.

## Contact

Have a question?

* [Raise an issue](https://github.com/skttl/matryoshka/issues) on GitHub


## Dev Team

* [Søren Kottal](https://github.com/skttl)

### Special Thanks

* Thanks to [Sebastiaan Janssen](https://github.com/nul800sebastiaan) for creating and releasing [Tabify](https://github.com/nul800sebastiaan/Cultiv.Tabify) which most of the tabbing functionality is based on.
* Thanks to [Supalerk Laipawat](https://thenounproject.com/photo3idea/) for the logo.

## License

Copyright &copy; 2020 Søren Kottal

Licensed under the [MIT License](LICENSE.md)
