# Attribution and provenance

Mariana Faithful is an unofficial adaptation of the Mariana color scheme by
**Sublime HQ Pty Ltd and Dmitri Voronianski**. It is not affiliated with or
endorsed by Sublime HQ.

The source palette and scope-color design were read from
`Color Scheme - Default/Mariana.sublime-color-scheme`, bundled with the official
Sublime Text **build 4215** archive. No Sublime Text binaries or original package
archives are distributed in this repository.

The MIT license in this repository covers the original porting implementation,
additional scope mappings, build and verification scripts, and adaptations.
It does not purport to relicense Sublime Text or grant rights in third-party
material beyond those held by the respective authors.

The VS Code workbench and ANSI terminal mappings are adaptations, not official
Sublime color definitions. Details and resolved source colors are recorded in
`palette.json`.

## Test grammars

Tests download grammar files from the Microsoft VS Code repository at the
revision pinned in `tests/grammar-sources.json`. They are cached locally and are
not included in theme packages. The VS Code repository is MIT-licensed; grammar
files may additionally reference their own upstream sources and notices, which
remain in the downloaded files. See the
[VS Code license](https://github.com/microsoft/vscode/blob/main/LICENSE.txt).

## References

- [Sublime Text download](https://www.sublimetext.com/download)
- [Sublime color schemes](https://www.sublimetext.com/docs/color_schemes.html)
- [VS Code source](https://github.com/microsoft/vscode)
