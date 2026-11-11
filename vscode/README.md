# Mariana Faithful

An unofficial port of Sublime Text's Mariana scheme, using the original palette
extracted from **Sublime Text build 4215**, rather than another converted theme.
Original palette and syntax design: **Sublime HQ Pty Ltd and Dmitri Voronianski**.

The editor uses Mariana's original background (`#303841`), foreground (`#D8DEE9`),
orange caret, green strings, teal function declarations, blue calls, orange
parameters and numbers, pink keywords, coral operators, and muted comments.
Comments retain the original nonitalic styling; library symbols retain italics.
Selection and current-line highlighting use the source's translucent blue-gray.

## Install

1. Download the VSIX from [GitHub Releases](https://github.com/ronlipke/mariana-faithful/releases),
   or build it with `npm ci` and `npm run package` from the repository root.
2. In VS Code, run **Extensions: Install from VSIX...** from the Command Palette
   (**Cmd-Shift-P** on macOS; **Ctrl-Shift-P** on Windows/Linux).
3. Select the downloaded file, or `dist/mariana-faithful-1.0.2.vsix` after building.
4. Run **Preferences: Color Theme**, then choose **Mariana Faithful**.

The same 16-color palette is included for VS Code's integrated terminal and the
companion Ghostty theme.

## Version 1.0.1

Markdown link labels now retain the normal text color, with teal delimiters
and blue underlined destinations. The same label correction covers reference
links and image descriptions.

## Fidelity choices

- **Semantic highlighting defaults off.** Sublime's original scheme is based on
  grammar scopes. Semantic providers can recolor those scopes after a file loads.
  This port keeps the grammar colors by default, and also supplies explicit
  semantic mappings if you choose to enable semantic highlighting in VS Code.
- Function definitions and calls remain distinct where the language grammar
  distinguishes them. Other scopes are adapted for VS Code's built-in grammars.
- Workbench chrome is a subdued extension of the source background, inspired by
  Sublime's Adaptive UI. Mariana is a color scheme, not a complete UI theme, so
  the sidebar, tabs, buttons and status bar are adaptations.
- Bracket nesting uses white section punctuation rather than introducing a
  rainbow of colors. Matching-bracket borders use the original orange accent.
- Sublime-only scope operators are translated into ordinary TextMate rules.
  Sublime's token-background and `foreground_adjust` effects cannot be duplicated
  completely by VS Code. The diff editor receives the original diff backgrounds.
- Existing `workbench.colorCustomizations`, `editor.tokenColorCustomizations`,
  `editor.semanticTokenColorCustomizations`, or an explicit
  `editor.semanticHighlighting.enabled` setting can override the theme.
- Syntax results can vary with language extensions, fonts and font rendering.

## Sources

- [Official Sublime Text download](https://www.sublimetext.com/download)
- [Sublime color scheme specification](https://www.sublimetext.com/docs/color_schemes.html)
- [VS Code color themes](https://code.visualstudio.com/api/extension-guides/color-theme)
- [VS Code semantic highlighting](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)

The porting implementation and adaptations are MIT-licensed. See [LICENSE.txt](LICENSE.txt)
and [NOTICE.md](NOTICE.md) for attribution and provenance. This is an unofficial
Sublime HQ adaptation, distributed as a VSIX rather than a Marketplace extension.
It contains no executable extension code.
