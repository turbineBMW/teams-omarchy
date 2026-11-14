const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('active app rail states follow the Omarchy accent', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  for (const state of ['Hover', 'Pressed', 'Selected']) {
    assert.match(
      template,
      new RegExp(`--colorNeutralForeground3Brand${state}: \\{\\{ accent \\}\\} !important;`),
    );
  }
});

test('activity feed surfaces follow the Omarchy palette', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  assert.match(
    template,
    /\[data-tid="activity-list-container"\][^{]*\{[^}]*background-color: transparent !important;/s,
  );
  assert.match(
    template,
    /\[data-tid="activity-feed-list-item"\]\[aria-selected="true"\][^{]*\{[^}]*background-color: \{\{ selection_background \}\} !important;/s,
  );
});

test('hosted calendar surfaces follow the Omarchy palette', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  assert.match(
    template,
    /\[data-app-section="CalendarSurfaceNavigationToolbar"\][^{]*\{[^}]*background-color: \{\{ dark_background \}\} !important;/s,
  );
  assert.match(
    template,
    /\[data-app-section="Surface_Month"\] \.monthDayCell[^{]*\{[^}]*background-color: \{\{ background \}\} !important;/s,
  );
  assert.match(
    template,
    /\[data-app-section="Surface_Month"\] > \.focusManagedEntry > div > \.customScrollBar[^{]*\{[^}]*background-color: \{\{ dark_background \}\} !important;/s,
  );
  assert.match(
    template,
    /calendarSurfaceEntry_[\s\S]*?outline: 1px solid \{\{ accent \}\} !important;/,
  );
  assert.match(
    template,
    /calendarSurfaceEntry_"\]::after[^{]*\{[^}]*box-shadow: 0 0 0 1px \{\{ accent \}\} !important;/s,
  );
  assert.match(
    template,
    /\[data-app-section="CalendarItemPeek"\][\s\S]*?background-color: \{\{ background \}\} !important;/,
  );
  assert.match(
    template,
    /\[data-app-section="CalendarItemPeek"\] \[role="textbox"\][^{]*\{[^}]*background-color: \{\{ dark_background \}\} !important;/s,
  );
  assert.match(
    template,
    /\[data-app-section="CalendarModule"\][^{]*\{[^}]*--neutralTertiaryAlt: var\(--omarchy-divider\) !important;/s,
  );
});

test('dividers blend foreground into background for light and dark themes', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  assert.match(
    template,
    /--omarchy-divider: color-mix\(in srgb, \{\{ foreground \}\} \d+%, \{\{ background \}\}\) !important;/,
  );
  // lighter_background is white in some light themes, so it cannot draw a divider.
  assert.doesNotMatch(template, /border(-\w+)?-color: \{\{ lighter_background \}\}/);
});

test('calendar meeting updates opened from Activity follow the Omarchy palette', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  assert.match(
    template,
    /\[data-tid="calendar-main-pane"\] \.globalEventContainer[^{]*\{[^}]*background-color: \{\{ background \}\} !important;/s,
  );
  assert.match(
    template,
    /\[data-tid="calv2-sf-quick-action-bar"\] \.ms-CommandBar[^{]*\{[^}]*background-color: \{\{ background \}\} !important;/s,
  );
  assert.match(
    template,
    /\[data-tid="calv2-sf-tracking-view"\][^{]*\{[^}]*background-color: \{\{ dark_background \}\} !important;/s,
  );
  assert.match(
    template,
    /\[data-tid="calv2-sf-join"\][^{]*\{[^}]*background-color: \{\{ accent \}\} !important;/s,
  );
});

test('outgoing message bubbles use the true Omarchy accent', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  const bubble = template.match(/\.fui-ChatMyMessage__body \{[\s\S]*?\n\}/);
  assert.ok(bubble, 'outgoing bubble rule is present');
  assert.match(bubble[0], /background-color: \{\{ accent \}\} !important;/);
  assert.match(bubble[0], /color: var\(--omarchy-on-accent\) !important;/);
  // Blending the accent into the background turns orange accents into brown.
  assert.doesNotMatch(bubble[0], /color-mix/);
  assert.match(
    template,
    /\.fui-ChatMyMessage__body a \{[\s\S]*?color: var\(--omarchy-on-accent\) !important;/,
  );
});

test('text on the accent is black or white, chosen from the accent lightness', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  // A light theme's background is near-white, so it cannot be the text on a
  // light accent such as orange; a lightness step picks black or white instead.
  assert.match(
    template,
    /--omarchy-on-accent: oklch\(from \{\{ accent \}\} clamp\(0, calc\(\(0\.\d+ - l\) \* infinity\), 1\) 0 0\) !important;/,
  );
  assert.match(template, /--colorNeutralForegroundOnBrand: var\(--omarchy-on-accent\) !important;/);

  // Every accent-filled surface uses it, never the theme background.
  const flat = template.replace(/\{\{\s*(\w+)\s*\}\}/g, '<$1>');
  const accentBlocks = flat.match(/\{[^{}]*\}/g).filter(block => block.includes('background-color: <accent>'));
  assert.ok(accentBlocks.length >= 5, 'accent-filled surfaces are present');
  for (const block of accentBlocks) {
    assert.match(block, /color: var\(--omarchy-on-accent\) !important;/);
    assert.doesNotMatch(block, /color: <background>/);
  }
});

test('sidebars are tinted by --teams-sidebar-opacity; the conversation stays opaque', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  assert.match(template, /:root \{ --teams-sidebar-opacity: 0\.8; \}/);
  assert.match(
    template,
    /\[data-tid="app-bar-wrapper"\] > div \{[^}]*rgb\(from \{\{ darker_background \}\} r g b \/ var\(--teams-sidebar-opacity\)\)/s,
  );
  assert.match(
    template,
    /\[data-tid="app-layout-area--mid-nav"\],\s*\[data-tid="app-layout-area--sub-nav"\],\s*\[data-tid="app-layout-area--start"\] \{[^}]*rgb\(from \{\{ dark_background \}\} r g b \/ var\(--teams-sidebar-opacity\)\)/s,
  );
  // Only the Teams document is cleared; hosted frames keep an opaque page.
  assert.match(template, /:is\(html, body\):has\(\[data-tid="experience-layout"\]\) \{[^}]*transparent/s);
  assert.match(
    template,
    /\[data-tid="experience-layout"\] > div:not\([^)]*\) \{[^}]*background-color: \{\{ background \}\} !important;/s,
  );
});

test('title bar controls are pinned to the chat list header and rail, search stays focusable', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  assert.match(template, /\[data-tid="title-bar"\] \{\s*visibility: hidden !important;/);
  // The toggle and history buttons follow the chat list when the rail collapses.
  for (const control of ['\\[data-tid="hamburger-button"\\]', '#tfl-nav-buttons-container']) {
    assert.match(template, new RegExp('\\n' + control + ' \\{[^}]*left: calc\\(var\\(--omarchy-list-left\\) \\+ \\d+px\\)', 's'));
  }
  const collapsed = '\\[data-tid="experience-layout"\\]:has\\(\\[data-tid="hamburger-button"\\]\\[aria-label="Expand app bar"\\]\\)';
  assert.match(template, new RegExp(collapsed + ' \\{\\s*--omarchy-list-left: 0px;'));
  assert.match(template, new RegExp(collapsed + '\\s*:is\\(\\[data-tid="me-control-avatar-trigger"\\], #more-options-header\\) \\{\\s*visibility: hidden'));
  assert.match(template, /\[data-tid="search-f6-navigation-region"\]:focus-within \{/);
});

test('list panel separators are translucent', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  assert.match(template, /--colorNeutralStrokeSubtle: var\(--omarchy-divider\) !important;/);
  assert.match(
    template,
    /\[data-tid="app-layout-area--mid-nav"\],\s*\[data-tid="app-layout-area--sub-nav"\],\s*\[data-tid="app-layout-area--start"\] \{\s*--colorNeutralStroke1:(?:[^;]*;\s*)*?--colorNeutralStrokeSubtle: rgb\(from \{\{ foreground \}\} r g b \/ 0\.12\) !important;/s,
  );
});

test('calendar toolbar and navigation pane leave room for the pinned buttons', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  assert.match(template, /\[data-app-section="CalendarSurfaceNavigationToolbar"\] \{\s*padding-left: 116px !important;/);
  assert.match(template, /#leftPaneScrollContainer \{\s*padding-top: 48px !important;/);
  // An opened event's title row (above the event form toolbar) clears them too.
  assert.match(template, /div:has\(> div > div > div > div > div > \[data-app-section="Toolbar"\]\) > div:first-child > div \{\s*padding-left: 132px !important;\s*height: 60px !important;/);
});

test('pinned buttons paint above app headers; Calls header starts after them', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  assert.match(template, /\[data-tid="app-layout-area--title-bar"\] \{\s*position: relative !important;\s*z-index: 100 !important;/);
  assert.match(template, /\[data-tid="entity-header"\]:has\(#calling-calls-app-header\) \{\s*padding-left: 120px !important;/);
  assert.match(template, /\[data-tid="app-layout-area--start"\] > \[data-tid="slot-measurer"\] \{\s*background-color: transparent !important;/);
});

test('Calls panels reach up behind a cleared header', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );
  const calls = '\\[data-tid="experience-layout"\\]:has\\(#calling-calls-app-header\\)';

  assert.match(template, new RegExp(`${calls} \\[data-tid="app-layout-area--header"\\] \\{\\s*z-index: 1 !important;\\s*background-color: transparent !important;`));
  assert.match(template, new RegExp(`${calls} \\[data-tid="entity-header"\\] \\{\\s*border-bottom-color: rgb\\(from \\{\\{ foreground \\}\\} r g b / 0\\.12\\) !important;`));
  assert.match(template, new RegExp(`${calls} :is\\([^)]*app-layout-area--start[^)]*\\) \\{\\s*margin-top: calc\\(-1 \\* var\\(--omarchy-header-height\\)\\) !important;\\s*height: calc\\(100% \\+ var\\(--omarchy-header-height\\)\\) !important;\\s*max-height: none !important;\\s*padding-top: var\\(--omarchy-header-height\\) !important;`));
});

test('OneDrive and Copilot frames are themed with translucent sidebars', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../themes/teams.css.tpl'),
    'utf8',
  );

  // SharePoint's Fluent 9 tokens sit on a [data-theme] element below :root.
  assert.match(template, /^:root, body, \.fui-FluentProvider, \[class\*="fui-FluentProvider"\], \[data-theme\^="fluent-"\] \{/m);
  // Only the visible OneDrive or Copilot iframe clears the Teams surface behind it.
  assert.match(template, /\[data-tid="slot-measurer"\]:has\(> \[data-tid="persisted-app-content-main"\]\s*:is\(iframe\[data-appid="5af6a76b-40fc-4ba1-af29-8f49b08e44fd"\],\s*iframe\[data-appid="b5abf2ae-c16b-4310-8f8a-d3bcdb52f162"\]\)\[style\*="visibility: visible"\]\) \{\s*background-color: transparent !important;/);
  assert.match(template, /html\[class\*="teamsFiles"\] \{\s*--ms-palette-white: \{\{ background \}\} !important;/);
  for (const sidebar of ['html\\[class\\*="teamsFiles"\\] \\.leftNav', '#m365-copilot-app-layout-main div:has\\(> \\.fai-CopilotNavDrawer\\)']) {
    assert.match(template, new RegExp(`${sidebar} \\{\\s*background-color: rgb\\(from \\{\\{ dark_background \\}\\} r g b / var\\(--teams-sidebar-opacity\\)\\) !important;`));
  }
  // Fluent 8 semantic colours are literals, so the file list needs its own mapping.
  assert.match(template, /--ms-semanticColors-listBackground: \{\{ background \}\} !important;/);
  assert.match(template, /--ms-semanticColors-listItemBackgroundHovered: \{\{ lighter_background \}\} !important;/);
  assert.doesNotMatch(template, /--ms-semanticColors-(error|warning|success)/);
  assert.match(template, /\.odspSpartanList \[role="row"\]:not\(:hover, \[aria-selected="true"\]\) \{\s*border-color: var\(--omarchy-divider\) !important;/);
  assert.match(template, /html\[class\*="teamsFiles"\] \.action-row-container \{\s*background-color: \{\{ background \}\} !important;/);
  // Copilot's header row is higher, so the pinned buttons move up with it.
  assert.match(template, /:has\(iframe\[data-appid="b5abf2ae-c16b-4310-8f8a-d3bcdb52f162"\]\[style\*="visibility: visible"\]\) \{\s*--omarchy-buttons-top: 9px;/);
  // Copilot's layered !important drawer background is cleared through its variable.
  assert.match(template, /\.fai-CopilotNavDrawer \{\s*--m365-copilot-canvas-background: transparent !important;/);
  assert.match(template, /\[data-testid="expand-button"\]:has\(~ \.fai-CopilotNavDrawer\) \{\s*visibility: hidden !important;/);
});
