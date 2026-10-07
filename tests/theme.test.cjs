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
    /\[data-tid="activity-list-container"\][^{]*\{[^}]*background-color: \{\{ dark_background \}\} !important;/s,
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
  assert.match(bubble[0], /color: \{\{ background \}\} !important;/);
  // Blending the accent into the background turns orange accents into brown.
  assert.doesNotMatch(bubble[0], /color-mix/);
  assert.match(
    template,
    /\.fui-ChatMyMessage__body a \{[\s\S]*?color: \{\{ background \}\} !important;/,
  );
});
