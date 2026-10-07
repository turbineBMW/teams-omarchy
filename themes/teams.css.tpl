/* Omarchy palette for Microsoft Teams / Fluent UI. Color changes only. */
:root, body, .fui-FluentProvider, [class*="fui-FluentProvider"] {
  /* Foreground/background blend keeps dividers subtle in light and dark themes. */
  --omarchy-divider: color-mix(in srgb, {{ foreground }} 14%, {{ background }}) !important;
  --colorNeutralBackground1: {{ background }} !important;
  --colorNeutralBackground1Hover: {{ lighter_background }} !important;
  --colorNeutralBackground1Pressed: {{ selection_background }} !important;
  --colorNeutralBackground1Selected: {{ lighter_background }} !important;
  --colorNeutralBackground2: {{ dark_background }} !important;
  --colorNeutralBackground2Hover: {{ lighter_background }} !important;
  --colorNeutralBackground2Pressed: {{ selection_background }} !important;
  --colorNeutralBackground2Selected: {{ lighter_background }} !important;
  --colorNeutralBackground3: {{ darker_background }} !important;
  --colorNeutralBackground3Hover: {{ lighter_background }} !important;
  --colorNeutralBackground3Selected: {{ selection_background }} !important;
  --colorNeutralBackground4: {{ dark_background }} !important;
  --colorNeutralBackground5: {{ darker_background }} !important;
  --colorNeutralBackground6: {{ lighter_background }} !important;
  --colorNeutralBackgroundStatic: {{ darker_background }} !important;
  --colorNeutralBackgroundInverted: {{ foreground }} !important;
  --colorNeutralBackgroundDisabled: {{ lighter_background }} !important;
  --colorSubtleBackgroundHover: {{ lighter_background }} !important;
  --colorSubtleBackgroundPressed: {{ selection_background }} !important;
  --colorSubtleBackgroundSelected: {{ selection_background }} !important;
  --colorNeutralForeground1: {{ foreground }} !important;
  --colorNeutralForeground1Hover: {{ foreground }} !important;
  --colorNeutralForeground1Pressed: {{ foreground }} !important;
  --colorNeutralForeground1Selected: {{ foreground }} !important;
  --colorNeutralForeground2: {{ light_foreground }} !important;
  --colorNeutralForeground2Hover: {{ foreground }} !important;
  --colorNeutralForeground2Pressed: {{ foreground }} !important;
  --colorNeutralForeground2Selected: {{ foreground }} !important;
  --colorNeutralForeground3: {{ light_foreground }} !important;
  --colorNeutralForeground3BrandHover: {{ accent }} !important;
  --colorNeutralForeground3BrandPressed: {{ accent }} !important;
  --colorNeutralForeground3BrandSelected: {{ accent }} !important;
  --colorNeutralForeground4: {{ dark_foreground }} !important;
  --colorNeutralForegroundDisabled: {{ muted }} !important;
  --colorNeutralForegroundInverted: {{ background }} !important;
  --colorNeutralForegroundOnBrand: {{ background }} !important;
  --colorNeutralStroke1: {{ muted }} !important;
  --colorNeutralStroke1Hover: {{ accent }} !important;
  --colorNeutralStroke1Pressed: {{ accent }} !important;
  --colorNeutralStroke2: var(--omarchy-divider) !important;
  --colorNeutralStroke3: var(--omarchy-divider) !important;
  --colorNeutralStrokeAccessible: {{ muted }} !important;
  --colorNeutralStrokeAccessibleHover: {{ accent }} !important;
  --colorNeutralStrokeAccessibleSelected: {{ accent }} !important;
  --colorBrandBackground: {{ accent }} !important;
  --colorBrandBackgroundHover: color-mix(in srgb, {{ accent }} 85%, {{ foreground }}) !important;
  --colorBrandBackgroundPressed: color-mix(in srgb, {{ accent }} 80%, {{ background }}) !important;
  --colorBrandBackgroundSelected: {{ accent }} !important;
  --colorBrandBackground2: color-mix(in srgb, {{ accent }} 16%, {{ background }}) !important;
  --colorBrandBackground2Hover: color-mix(in srgb, {{ accent }} 24%, {{ background }}) !important;
  --colorBrandForeground1: {{ accent }} !important;
  --colorBrandForeground2: {{ accent }} !important;
  --colorBrandForegroundLink: {{ blue }} !important;
  --colorBrandForegroundLinkHover: {{ cyan }} !important;
  --colorBrandForegroundLinkPressed: {{ blue }} !important;
  --colorBrandStroke1: {{ accent }} !important;
  --colorBrandStroke2: {{ accent }} !important;
  --colorCompoundBrandBackground: {{ accent }} !important;
  --colorCompoundBrandBackgroundHover: {{ accent }} !important;
  --colorCompoundBrandForeground1: {{ accent }} !important;
  --colorCompoundBrandForeground1Hover: {{ accent }} !important;
  --colorCompoundBrandStroke: {{ accent }} !important;
  --colorStrokeFocus2: {{ accent }} !important;
}
html, body {
  background-color: {{ background }} !important;
  color: {{ foreground }} !important;
}
::selection {
  background: {{ selection_background }} !important;
  color: {{ foreground }} !important;
}

/* Outgoing bubbles have their own component background, outside the token map.
   The accent is used as-is: blending it into the background turns warm accents
   such as orange into brown. Text uses the on-brand color for contrast. */
.fui-FluentProvider .fui-ChatMyMessage__body {
  background-color: {{ accent }} !important;
  color: {{ background }} !important;
}
.fui-FluentProvider .fui-ChatMyMessage__body a {
  color: {{ background }} !important;
  text-decoration: underline !important;
}

/* Teams' conversation rail and headers use additional surface styles. */
[data-tid="app-layout-area--mid-nav"],
[data-tid="simple-collab-dnd-rail"],
[data-testid="simple-collab-rail"] {
  background-color: {{ dark_background }} !important;
  color: {{ foreground }} !important;
}
[data-tid="entity-header"] {
  background-color: {{ background }} !important;
  color: {{ foreground }} !important;
  border-bottom-color: var(--omarchy-divider) !important;
}

/* Activity uses a separate sub-nav and fixed surfaces outside the token map. */
[data-tid="activity-list-container"] {
  background-color: {{ dark_background }} !important;
  color: {{ foreground }} !important;
}
[data-tid="default-feed-header"] {
  border-bottom-color: var(--omarchy-divider) !important;
}
[data-tid="activity-feed-list-item"]:hover:not([aria-selected="true"]) {
  background-color: {{ lighter_background }} !important;
}
[data-tid="activity-feed-list-item"][aria-selected="true"] {
  background-color: {{ selection_background }} !important;
  border-color: {{ muted }} !important;
}

/* Calendar meeting updates opened from Activity use fixed Teams surfaces. */
[data-tid="calendar-main-pane"] .globalEventContainer {
  background-color: {{ background }} !important;
  color: {{ foreground }} !important;
  border-bottom-color: var(--omarchy-divider) !important;
}
[data-tid="calv2-sf-quick-action-bar"] .ms-CommandBar {
  background-color: {{ background }} !important;
  color: {{ foreground }} !important;
}
[data-tid="calv2-sf-tracking-view"] {
  background-color: {{ dark_background }} !important;
  color: {{ foreground }} !important;
}
[data-tid="calv2-sf-join"] {
  background-color: {{ accent }} !important;
  color: {{ background }} !important;
}
[data-tid="calv2-sf-rsvp"],
[data-tid="calv2-sf-show-or-hide-button"] {
  color: {{ accent }} !important;
}
[data-tid="calv2-sf-rsvp"] svg,
[data-tid="calv2-sf-show-or-hide-button"] svg {
  fill: {{ accent }} !important;
}
[data-tid="slot-measurer"][data-app-name="schedulingform"][data-slot-name="header"]
  [data-tid="entity-header"] > div:first-child > div:first-child > div:first-child {
  background-color: {{ accent }} !important;
  color: {{ background }} !important;
}

/* Teams hosts Calendar in an isolated Outlook frame with legacy Fabric CSS. */
[data-app-section="CalendarSurfaceNavigationToolbar"] {
  background-color: {{ dark_background }} !important;
  border-color: var(--omarchy-divider) !important;
}
[data-app-section="Surface_Month"] {
  background-color: {{ dark_background }} !important;
  color: {{ foreground }} !important;
  border-color: var(--omarchy-divider) !important;
}
/* Legacy Fabric stroke behind the calendar frame, grid, and weekday dividers. */
[data-app-section="CalendarModule"] {
  --neutralTertiaryAlt: var(--omarchy-divider) !important;
}
[data-app-section="Surface_Month"] > .focusManagedEntry > div > .customScrollBar {
  background-color: {{ dark_background }} !important;
}
[data-app-section="Surface_Month"] .monthDayCell {
  background-color: {{ background }} !important;
  color: {{ foreground }} !important;
  border-color: var(--omarchy-divider) !important;
}
[data-app-section="Surface_Month"] .calendarGridEntry,
[data-app-section="Surface_Month"] [data-conflict] {
  border-color: var(--omarchy-divider) !important;
}
[data-app-section="Surface_Month"] [data-tabid^="calendarSurfaceEntry_"] {
  background-color: {{ selection_background }} !important;
  outline: 1px solid {{ accent }} !important;
  outline-offset: -1px !important;
}
/* Outlook draws a second today ring from --themePrimary, Teams' purple. */
[data-app-section="Surface_Month"] [data-tabid^="calendarSurfaceEntry_"]::after {
  box-shadow: 0 0 0 1px {{ accent }} !important;
}
[data-app-section="Surface_Month"] [data-tabid^="calendarSurfaceEntry_"]
  > [aria-hidden="true"] > div:first-child {
  background-color: {{ accent }} !important;
  color: {{ background }} !important;
}
[data-app-section="Surface_Month"] [data-icon-name="HomeFilled"] {
  color: {{ accent }} !important;
}

/* Outlook's event peek is outside the month surface and uses legacy colors. */
[data-app-section="CalendarItemPeek"] {
  color: {{ foreground }} !important;
}
[data-app-section="CalendarItemPeek"] > [tabindex="-1"] > div:nth-child(2) > div:first-child,
[data-app-section="CalendarItemPeek"] .customScrollBar > div,
[data-app-section="CalendarItemPeek"] .customScrollBar ~ div:not([role="presentation"]) {
  background-color: {{ background }} !important;
  color: {{ foreground }} !important;
}
[data-app-section="CalendarItemPeek"] > [tabindex="-1"] > div:nth-child(2) > div:last-child {
  background-color: {{ dark_background }} !important;
  color: {{ foreground }} !important;
}
[data-app-section="CalendarItemPeek"] [role="textbox"] {
  background-color: {{ dark_background }} !important;
  color: {{ foreground }} !important;
  border-color: var(--omarchy-divider) !important;
}
[data-app-section="CalendarItemPeek"]
  button:not(.fui-SplitButton__primaryActionButton):not(.fui-SplitButton__menuButton) {
  background-color: transparent !important;
  color: {{ foreground }} !important;
  border-color: {{ muted }} !important;
}
[data-app-section="CalendarItemPeek"] .fui-SplitButton,
[data-app-section="CalendarItemPeek"] .fui-SplitButton__primaryActionButton,
[data-app-section="CalendarItemPeek"] .fui-SplitButton__menuButton,
[data-app-section="CalendarItemPeek"] [data-ktp-target="true"] {
  background-color: {{ accent }} !important;
  color: {{ background }} !important;
  border-color: {{ accent }} !important;
}
[data-app-section="CalendarItemPeek"] div[role="presentation"] {
  border-color: var(--omarchy-divider) !important;
}
