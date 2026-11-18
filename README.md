# Teams + Omarchy

Make Microsoft Teams follow your Omarchy palette, including the conversation
list, activity feed, conversation header, hosted calendar, and the OneDrive and
Copilot apps, with see-through sidebars and no title bar. Colors update
within about one second without a page reload, so changing themes does not
restart Teams or interrupt a call.

This is an experimental, independent integration for **Teams for Linux**, not an
official Microsoft, Teams for Linux, or Omarchy feature.

## Quick start

Download and extract `teams-omarchy-0.1.1.tar.gz`, then:

```sh
tar -xzf teams-omarchy-0.1.1.tar.gz
cd teams-omarchy
./install.sh --dry-run
# Quit Teams completely, including its system-tray icon.
./install.sh
```

Open Teams from the application launcher. Change your Omarchy theme as usual.
Installation needs no sudo. The installer does not restart Teams automatically.

Requirements:

- Linux with a native Teams for Linux installation. Auto-detection checks
  `/opt/teams-for-linux`, `/usr/lib/teams-for-linux`, `/usr/share/teams-for-linux`,
  and the directory behind `/usr/bin/teams-for-linux`.
- A recent Omarchy with `omarchy theme color --all`, user theme templates,
  and the active theme at `~/.local/state/omarchy/current/theme`.
- Node.js 22.12+ and npm on your PATH; GNU `cp` and Bash.
- Internet access during installation for the locked `@electron/asar` dependency
  and its dependencies. No additional network service is used for theme updates.

Another native installation location:

```sh
./install.sh --teams-dir /path/to/teams-for-linux
```

Flatpak, Snap, AppImage, old Omarchy theme layouts, and customized XDG directory
locations are not supported by this release. Tested interactively with Teams for
Linux **2.28.0** (and the colors alone with **2.20.1**) on the author's Omarchy
setup. Other layouts and future Teams versions need verification; Teams' HTML and
color tokens can change.

## How it works

1. Omarchy renders `teams.css.tpl` from its current color palette when you switch
   themes. The installer also renders the current palette immediately.
2. A user-local Electron launcher loads the installed Teams app and a small
   main-process theme module. The system Teams package is left untouched.
3. The module checks the stylesheet every second and replaces one style element
   per Teams frame when its contents change. It reopens the path each time, so
   Omarchy replacing the entire theme directory does not break updates.

The module only injects into HTTPS Teams origins and three apps Teams hosts in
frames: the `outlook.office.com/hosted/calendar/` path, the OneDrive file browser
(`*.sharepoint.com/…/_layouts/15/filebrowser.aspx`), and Copilot
(`m365copilotapp.svc.cloud.microsoft`). Other SharePoint pages, such as documents
opened in Teams, are left alone. It does not theme Outlook mail, open a debugging
port, send chat messages, or require a separate daemon. Your existing Teams profile and login are reused. Existing custom CSS
configuration is not edited.

The integration maps Fluent UI colors, including the selected app-rail icon and
indicator, and explicitly targets the conversation and activity rails plus the
conversation header, calendar chrome, event peek, and Activity meeting details.
Calendar event/category colors, images, and embedded documents keep their
original colors.
Outgoing message bubbles use the theme's accent color as-is, with black or white
text and underlined links, so they stay readable and distinct from received
messages without keeping Teams' original purple. The text color is chosen in CSS
from the accent's OKLCH lightness, so a light accent such as orange gets black
text in both light and dark themes, and a dark accent gets white text. The same
on-accent color is used for Fluent's on-brand foreground (primary buttons) and
the calendar's accent surfaces. The accent is not blended into the background,
because that turns warm accents such as orange into brown. This targets
`.fui-ChatMyMessage__body`, whose separate component background bypasses our
Fluent token overrides.
Some hardcoded UI colors may need additional mappings.

### Window layout

The template also rearranges the window, in the style of Bubo, Vmux and Rustle:

- The app rail and chat list are see-through, so the desktop (and Hyprland's
  blur, if enabled) shows behind them. The conversation, bubbles, menus and
  dialogs stay opaque.
- Teams' title bar is gone. The app-rail toggle, back and forward sit at the
  left of the chat list header, with its title centred, and move with the list
  when the rail is collapsed. *Settings and more* and your profile picture sit at
  the foot of the app rail and hide with it. The Office app launcher is hidden.
- Separators in the chat list are translucent too.
- Search is hidden until you press Ctrl+Alt+E, then drops in at the top centre.

Apps without a list beside the rail make room for the buttons in their own way:

- **Activity** uses the same see-through list and centred title as Chat.
- **Calls**: the left panel is see-through and runs up behind the header, with
  Calls and its tabs on it.
- **Calendar**: the toolbar and the navigation pane start below and after the
  buttons. An opened event's title bar is as tall as the other headers, with
  the title after the buttons.
- **Store**: the header row starts after the buttons.
- **OneDrive** and **Copilot** are pages from other Microsoft sites in a frame.
  They get the palette too (OneDrive through its Fluent 8 palette and semantic
  colours, Copilot through the Fluent tokens), see-through sidebars, and their
  titles and own sidebar buttons after ours. Status colours (errors, warnings)
  and file thumbnails keep their original colours.

To allow this, `transparent-window.cjs` makes the launcher create the Teams main
window with an alpha channel (Electron only allows this when a window is
created). The window's other dialogs and pop-ups are unchanged. The buttons are
pinned with fixed positions rather than by moving Teams' DOM, so their menus and
shortcuts keep working. The collapsed rail is recognised by the toggle's English
label (*Expand app bar*); in other languages the controls stay where they are
with the rail expanded.

Teams keeps hidden areas and app frames in the page, so each app's adjustments
are matched to that app (for OneDrive and Copilot, by the Teams app ID of the
visible frame). An app this does not know yet may have its own title under the
buttons. Some rules match Microsoft's page structure rather than stable names,
so a Teams, SharePoint, Outlook or Copilot update can undo one of them; the
affected title then falls back under the buttons, and nothing else breaks.

## Source layout

```text
teams-omarchy/
├── install.sh
├── uninstall.sh
├── README.md
├── LICENSE
├── package.json
├── package-lock.json
├── themes/
│   └── teams.css.tpl
├── src/
│   ├── live-theme.cjs       # Live CSS replacement in Teams frames
│   ├── transparent-window.cjs  # Create the main window with an alpha channel
│   ├── prepare.cjs          # Build/cache the local Electron bootstrap
│   ├── render.cjs           # Render the template without switching themes
│   └── live-theme.test.cjs
├── scripts/
│   └── setup.cjs            # Install, back up, restore, and uninstall
└── tests/
    ├── prepare.test.cjs
    ├── setup.test.cjs
    ├── theme.test.cjs
    └── transparent-window.test.cjs
```

## Installed layout

```text
~/.config/omarchy/themed/teams.css.tpl
~/.local/state/omarchy/current/theme/teams.css   # Generated by Omarchy
~/.local/bin/teams-for-linux                    # User launcher
~/.local/share/applications/teams-for-linux.desktop
~/.local/share/teams-omarchy/
├── live-theme.cjs
├── transparent-window.cjs
├── prepare.cjs
├── render.cjs
├── settings.json                              # Native Teams location
├── install-manifest.json                      # Recovery records
├── package.json, package-lock.json, README.md
├── live-theme.test.cjs
├── node_modules/
└── runtime/<build-id>/                        # Local Electron bootstrap
~/.local/share/teams-omarchy-backups/           # Previous and disabled installs
```

The launcher uses the installed system package's JavaScript and assets. It makes
a local copy of its Electron executable (a reflink when supported). System package
updates cause a new runtime build on the next launch. Old runtime builds are
retained; remove unused builds only after Teams exits. Future entry-point changes
cause an explicit error rather than launching an incompatible bootstrap.

## Customize

Edit `~/.config/omarchy/themed/teams.css.tpl`, then apply immediately:

```sh
node ~/.local/share/teams-omarchy/render.cjs
```

### See-through sidebars

The app rail and chat list can let the desktop show through (only their
backgrounds fade, never the text). This is teams-omarchy's own setting in
`~/.config/teams-omarchy/config.json`, not the theme's, so no template or theme
changes it:

```sh
node ~/.local/share/teams-omarchy/config.cjs on      # turn it on
node ~/.local/share/teams-omarchy/config.cjs 70%     # on, at 70% (or 0.7)
node ~/.local/share/teams-omarchy/config.cjs off
node ~/.local/share/teams-omarchy/config.cjs status
```

Teams picks the change up within a second. Earlier versions set
`--teams-sidebar-opacity` in the template; installing this one carries that
value into the config first, so the sidebars look the same afterwards.

To keep Teams' own title bar, delete the *Window layout* section of the
template. The *OneDrive and Copilot* section after it can stay; their sidebars
then sit on an opaque background.

No restart is needed for CSS edits or normal theme switches. Changes to the
JavaScript integration itself require quitting and reopening Teams.

## Update or uninstall

Quit Teams, then run the new download's `./install.sh` to update. Existing files,
including a customized template, are backed up before replacement. Installation
failure restores the prior files. The launcher records the Node executable used
at install time; rerun installation if a Node version manager removes that binary.

To undo the latest installation, use the extracted source folder:

```sh
./uninstall.sh --dry-run
# Quit Teams completely.
./uninstall.sh
```

Uninstall restores anything that was present before installation. The disabled
installation and subsequent edits are retained in the backup directory. If you
installed over an earlier version of this integration, uninstall restores that
earlier version; run it again to undo that version as well. A manually installed
version without an installer manifest needs manual removal of its launcher and
desktop override. Teams login/profile files are never removed.

## Development and sharing

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm test
```

Tests cover live replacement, atomic directory swaps, navigation, detached frames,
origin filtering, the transparent-window hook, the template's layout rules, dry
runs, preserving existing files, uninstall, and rollback.
Installer tests use temporary directories and mocked package/build commands.

The release archive contains only this integration's source. It excludes the
Teams binary, runtime caches, `node_modules`, screenshots, and profile data.
It can be attached to a GitHub release or shared directly. No repository or release
is published automatically by these scripts.

Licensed under MIT. Teams for Linux, Electron, and npm dependencies retain their
own licenses; they are not included in the source release.
