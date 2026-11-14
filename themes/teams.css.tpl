/* Omarchy palette for Microsoft Teams / Fluent UI, plus a window layout with
   translucent sidebars and no title bar, and the OneDrive and Copilot apps
   (see the last two sections). */
:root, body, .fui-FluentProvider, [class*="fui-FluentProvider"], [data-theme^="fluent-"] {
  /* Foreground/background blend keeps dividers subtle in light and dark themes. */
  --omarchy-divider: color-mix(in srgb, {{ foreground }} 14%, {{ background }}) !important;
  /* Text on the accent: black when the accent is light, white when it is dark.
     The step is negative once OKLCH lightness passes 0.57, where black and white
     text have equal WCAG contrast; clamp() turns it into 0 (black) or 1 (white).
     The theme background is near-white in light themes, so it cannot be used. */
  --omarchy-on-accent: oklch(from {{ accent }} clamp(0, calc((0.57 - l) * infinity), 1) 0 0) !important;
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
  --colorNeutralForegroundOnBrand: var(--omarchy-on-accent) !important;
  --colorNeutralStroke1: {{ muted }} !important;
  --colorNeutralStroke1Hover: {{ accent }} !important;
  --colorNeutralStroke1Pressed: {{ accent }} !important;
  --colorNeutralStroke2: var(--omarchy-divider) !important;
  --colorNeutralStroke3: var(--omarchy-divider) !important;
  --colorNeutralStrokeSubtle: var(--omarchy-divider) !important;
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
/* See-through sidebars, like Bubo, Vmux and Rustle: a number from 0 to 1 (not a
   percentage) that fades the app rail and chat list backgrounds, not their text.
   The launcher creates the window with an alpha channel; at 1 nothing shows through. */
:root { --teams-sidebar-opacity: 0.8; }
::selection {
  background: {{ selection_background }} !important;
  color: {{ foreground }} !important;
}

/* Outgoing bubbles have their own component background, outside the token map.
   The accent is used as-is: blending it into the background turns warm accents
   such as orange into brown. Text is black or white to contrast with the accent. */
.fui-FluentProvider .fui-ChatMyMessage__body {
  background-color: {{ accent }} !important;
  color: var(--omarchy-on-accent) !important;
}
.fui-FluentProvider .fui-ChatMyMessage__body a {
  color: var(--omarchy-on-accent) !important;
  text-decoration: underline !important;
}

/* Teams' conversation rail and headers use additional surface styles. */
[data-tid="app-layout-area--mid-nav"],
[data-tid="simple-collab-dnd-rail"],
[data-testid="simple-collab-rail"] {
  color: {{ foreground }} !important;
}
/* The list area itself carries the (translucent) colour; see the layout section. */
[data-tid="simple-collab-dnd-rail"],
[data-testid="simple-collab-rail"] {
  background-color: transparent !important;
}
[data-tid="entity-header"] {
  background-color: {{ background }} !important;
  color: {{ foreground }} !important;
  border-bottom-color: var(--omarchy-divider) !important;
}

/* Activity uses a separate sub-nav and fixed surfaces outside the token map. */
[data-tid="activity-list-container"] {
  background-color: transparent !important;
  color: {{ foreground }} !important;
}
[data-tid="default-feed-header"] {
  /* Translucent over the see-through list (set for the sub-nav below). */
  border-bottom-color: var(--colorNeutralStrokeSubtle) !important;
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
  color: var(--omarchy-on-accent) !important;
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
  color: var(--omarchy-on-accent) !important;
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
  color: var(--omarchy-on-accent) !important;
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
  color: var(--omarchy-on-accent) !important;
  border-color: {{ accent }} !important;
}
[data-app-section="CalendarItemPeek"] div[role="presentation"] {
  border-color: var(--omarchy-divider) !important;
}

/* ---- Window layout: translucent sidebars, no title bar ---------------------
   Only the Teams document (the one holding the app layout) is cleared, so the
   hosted calendar and other frames keep their own opaque page. */
:is(html, body):has([data-tid="experience-layout"]) {
  background-color: transparent !important;
}
[data-tid="app-bar-wrapper"] > div {
  background-color: rgb(from {{ darker_background }} r g b / var(--teams-sidebar-opacity)) !important;
}
/* The panel beside the rail: mid-nav in Chat, sub-nav in Activity, start in
   Calls (whose own wrapper is painted, so it is cleared). */
[data-tid="app-layout-area--mid-nav"],
[data-tid="app-layout-area--sub-nav"],
[data-tid="app-layout-area--start"] {
  background-color: rgb(from {{ dark_background }} r g b / var(--teams-sidebar-opacity)) !important;
}
[data-tid="app-layout-area--start"] > [data-tid="slot-measurer"] {
  background-color: transparent !important;
}
/* Teams' overlay areas (global side panel, modal, preview, toasts) had the
   cleared page background behind them. App content sits one level deeper and
   paints its own background. */
[data-tid="experience-layout"] > div:not([data-tid="app-layout-area--nav"],
  [data-tid="app-layout-area--mid-nav"], [data-tid="app-layout-area--sub-nav"],
  [data-tid="app-layout-area--start"], [data-tid="app-layout-area--title-bar"]) {
  background-color: {{ background }} !important;
}

/* Separators over the see-through list are see-through too: the foreground at
   low alpha instead of an opaque blend with the theme background. */
[data-tid="app-layout-area--mid-nav"],
[data-tid="app-layout-area--sub-nav"],
[data-tid="app-layout-area--start"] {
  --colorNeutralStroke1: rgb(from {{ foreground }} r g b / 0.2) !important;
  --colorNeutralStroke2: rgb(from {{ foreground }} r g b / 0.12) !important;
  --colorNeutralStroke3: rgb(from {{ foreground }} r g b / 0.12) !important;
  --colorNeutralStrokeSubtle: rgb(from {{ foreground }} r g b / 0.12) !important;
  --colorNeutralStrokeAlpha: rgb(from {{ foreground }} r g b / 0.12) !important;
  --colorNeutralStrokeAlpha2: rgb(from {{ foreground }} r g b / 0.12) !important;
}

/* The title bar collapses to nothing. Its buttons stay in the DOM (so their
   menus, shortcuts and Teams for Linux's history buttons keep working) and are
   pinned elsewhere with fixed positions. The app rail is always 68px wide and
   the chat list starts after it. Teams hides a collapsed rail with a generated
   class, so the collapsed state is read from the toggle's label, which is
   English-only: in other languages the controls keep their expanded places. */
[data-tid="app-layout-area--title-bar"],
[data-tid="title-bar"] {
  height: 0 !important;
  min-height: 0 !important;
  overflow: visible !important;
}
[data-tid="title-bar"] {
  visibility: hidden !important;
}
/* Its pinned buttons must paint over the later layout areas (the opaque
   conversation and app headers). It has no height, so it covers nothing. */
[data-tid="app-layout-area--title-bar"] {
  position: relative !important;
  z-index: 100 !important;
}
[data-tid="waffle-open-button"] {
  display: none !important;
}
[data-tid="experience-layout"] {
  --omarchy-list-left: 68px;
  --omarchy-buttons-top: 15px;
}
[data-tid="experience-layout"]:has([data-tid="hamburger-button"][aria-label="Expand app bar"]) {
  --omarchy-list-left: 0px;
}

/* The app-rail toggle, back and forward take the chat list header's left end,
   and move with it when the rail is collapsed... */
[data-tid="hamburger-button"],
#tfl-nav-buttons-container,
[data-tid="me-control-avatar-trigger"],
#more-options-header {
  visibility: visible !important;
  position: fixed !important;
  z-index: 10 !important;
  margin: 0 !important;
}
[data-tid="hamburger-button"] {
  top: var(--omarchy-buttons-top) !important;
  left: calc(var(--omarchy-list-left) + 12px) !important;
}
#tfl-nav-buttons-container {
  top: calc(var(--omarchy-buttons-top) - 1px) !important;
  left: calc(var(--omarchy-list-left) + 46px) !important;
}
/* ...so the list title moves to the middle of its header. */
[data-testid="simple-collab-left-rail-header"],
[data-tid="default-feed-header"] {
  position: relative !important;
}
[data-testid="simple-collab-left-rail-header"] > h1,
[data-tid="default-feed-header"] > h1 {
  position: absolute !important;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
  margin: 0 !important;
}
[data-testid="simple-collab-left-rail-header"] > [role="toolbar"],
[data-tid="default-feed-header-menu"] {
  margin-left: auto !important;
}

/* Settings and more, and your profile, sit at the foot of the app rail and are
   hidden with it. */
[data-tid="me-control-avatar-trigger"] {
  bottom: 12px !important;
  left: 14px !important;
}
#more-options-header {
  bottom: 60px !important;
  left: 18px !important;
}
[data-tid="experience-layout"]:has([data-tid="hamburger-button"][aria-label="Expand app bar"])
  :is([data-tid="me-control-avatar-trigger"], #more-options-header) {
  visibility: hidden !important;
}

/* Search stays reachable from Ctrl+Alt+E: hidden above the window until it
   has focus, then it drops in at the top centre. */
[data-tid="search-f6-navigation-region"] {
  visibility: visible !important;
  position: fixed !important;
  z-index: 20 !important;
  top: 12px !important;
  left: 50% !important;
  width: min(640px, 60vw) !important;
  transform: translate(-50%, calc(-100% - 24px)) !important;
  transition: transform 120ms ease-out !important;
}
[data-tid="search-f6-navigation-region"]:focus-within {
  transform: translate(-50%, 0) !important;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.25) !important;
  border-radius: 6px !important;
}

/* Calendar has no list beside the rail: its Outlook frame starts there, so the
   toggle and history buttons sit over the frame's top-left corner (frame x 12 to
   112, rail expanded or not). Make room in the calendar toolbar, and keep the
   navigation pane's mini calendar below them when the pane is open. */
[data-app-section="CalendarSurfaceNavigationToolbar"] {
  padding-left: 116px !important;
}
#leftPaneScrollContainer {
  padding-top: 48px !important;
}
/* An opened calendar event's title row starts at the frame's left edge too:
   start the title after the buttons, and make the row as tall as the other
   app headers so the title and close button share the buttons' line. */
div:has(> div > div > div > div > div > [data-app-section="Toolbar"]) > div:first-child > div {
  padding-left: 132px !important;
  height: 60px !important;
}
/* Calls' header spans from the rail, so its icon and title would sit under the
   buttons; start it after them. (Hidden list areas stay in the layout, so this
   is matched per app rather than by the list's absence.) */
[data-tid="entity-header"]:has(#calling-calls-app-header) {
  padding-left: 120px !important;
}
/* The Calls header row is see-through over the left panel: the panels below
   reach up behind the header (the left one translucent, the others opaque) and
   the header itself is cleared, so the panel runs to the top of the window. */
[data-tid="experience-layout"]:has(#calling-calls-app-header) {
  --omarchy-header-height: 61px;
}
[data-tid="experience-layout"]:has(#calling-calls-app-header) [data-tid="app-layout-area--header"] {
  z-index: 1 !important;
  background-color: transparent !important;
}
[data-tid="experience-layout"]:has(#calling-calls-app-header) [data-tid="app-layout-area--header"] :is([data-tid="slot-measurer"], [data-tid="entity-header"]) {
  background-color: transparent !important;
}
[data-tid="experience-layout"]:has(#calling-calls-app-header) [data-tid="entity-header"] {
  border-bottom-color: rgb(from {{ foreground }} r g b / 0.12) !important;
}
[data-tid="experience-layout"]:has(#calling-calls-app-header) :is([data-tid="app-layout-area--main"], [data-tid="app-layout-area--end"]) {
  background-color: {{ background }} !important;
}
[data-tid="experience-layout"]:has(#calling-calls-app-header) :is([data-tid="app-layout-area--start"], [data-tid="app-layout-area--main"], [data-tid="app-layout-area--end"]) {
  margin-top: calc(-1 * var(--omarchy-header-height)) !important;
  height: calc(100% + var(--omarchy-header-height)) !important;
  max-height: none !important;
  padding-top: var(--omarchy-header-height) !important;
  box-sizing: border-box !important;
}
/* Store's header row (title, then Home / Featured / ... tabs) also starts at
   the rail, under the buttons. */
div:has(> div > [role="tablist"] > [data-tid="store-header-nav-home"]) {
  padding-left: 120px !important;
}

/* ---- OneDrive and Copilot ---------------------------------------------------
   Both are pages from other Microsoft sites in an iframe. Teams keeps every app
   it has opened in the page and shows one with an inline visibility style, so
   the frame behind the visible OneDrive or Copilot page is cleared and the page
   paints its own opaque content and translucent sidebar. */
[data-tid="slot-measurer"]:has(> [data-tid="persisted-app-content-main"]
  :is(iframe[data-appid="5af6a76b-40fc-4ba1-af29-8f49b08e44fd"],
      iframe[data-appid="b5abf2ae-c16b-4310-8f8a-d3bcdb52f162"])[style*="visibility: visible"]) {
  background-color: transparent !important;
}

/* Copilot's header row sits 6px higher than the list headers. */
[data-tid="experience-layout"]:has(iframe[data-appid="b5abf2ae-c16b-4310-8f8a-d3bcdb52f162"][style*="visibility: visible"]) {
  --omarchy-buttons-top: 9px;
}

/* OneDrive (SharePoint): Fluent 9 tokens (above) plus Fluent 8's palette. */
html[class*="teamsFiles"] {
  --ms-palette-white: {{ background }} !important;
  --ms-palette-neutralLighterAlt: {{ background }} !important;
  --ms-palette-neutralLighter: {{ lighter_background }} !important;
  --ms-palette-neutralLight: {{ selection_background }} !important;
  --ms-palette-neutralQuaternaryAlt: {{ selection_background }} !important;
  --ms-palette-neutralQuaternary: var(--omarchy-divider) !important;
  --ms-palette-neutralTertiaryAlt: var(--omarchy-divider) !important;
  --ms-palette-neutralTertiary: {{ muted }} !important;
  --ms-palette-neutralSecondaryAlt: {{ dark_foreground }} !important;
  --ms-palette-neutralSecondary: {{ light_foreground }} !important;
  --ms-palette-neutralPrimaryAlt: {{ light_foreground }} !important;
  --ms-palette-neutralPrimary: {{ light_foreground }} !important;
  --ms-palette-neutralDark: {{ foreground }} !important;
  --ms-palette-black: {{ foreground }} !important;
  --ms-palette-accent: {{ accent }} !important;
  --ms-palette-themePrimary: {{ accent }} !important;
  --ms-palette-themeSecondary: {{ accent }} !important;
  --ms-palette-themeTertiary: color-mix(in srgb, {{ accent }} 60%, {{ background }}) !important;
  --ms-palette-themeDarkAlt: color-mix(in srgb, {{ accent }} 85%, {{ foreground }}) !important;
  --ms-palette-themeDark: color-mix(in srgb, {{ accent }} 80%, {{ foreground }}) !important;
  --ms-palette-themeDarker: color-mix(in srgb, {{ accent }} 70%, {{ foreground }}) !important;
  --ms-palette-themeLight: color-mix(in srgb, {{ accent }} 30%, {{ background }}) !important;
  --ms-palette-themeLighter: color-mix(in srgb, {{ accent }} 16%, {{ background }}) !important;
  --ms-palette-themeLighterAlt: color-mix(in srgb, {{ accent }} 8%, {{ background }}) !important;
  /* Fluent 8 semantic colours are set as literals, not from the palette.
     Status colours (error, warning, success) are left as they are. */
  --ms-semanticColors-bodyBackground: {{ background }} !important;
  --ms-semanticColors-bodyFrameBackground: {{ background }} !important;
  --ms-semanticColors-listBackground: {{ background }} !important;
  --ms-semanticColors-menuBackground: {{ background }} !important;
  --ms-semanticColors-cardStandoutBackground: {{ background }} !important;
  --ms-semanticColors-inputBackground: {{ background }} !important;
  --ms-semanticColors-buttonBackground: {{ background }} !important;
  --ms-semanticColors-buttonBackgroundDisabled: {{ background }} !important;
  --ms-semanticColors-disabledBackground: {{ background }} !important;
  --ms-semanticColors-primaryButtonBackgroundDisabled: {{ background }} !important;
  --ms-semanticColors-bodyBackgroundHovered: {{ lighter_background }} !important;
  --ms-semanticColors-buttonBackgroundHovered: {{ lighter_background }} !important;
  --ms-semanticColors-menuItemBackgroundHovered: {{ lighter_background }} !important;
  --ms-semanticColors-listHeaderBackgroundHovered: {{ lighter_background }} !important;
  --ms-semanticColors-listItemBackgroundHovered: {{ lighter_background }} !important;
  --ms-semanticColors-bodyStandoutBackground: {{ dark_background }} !important;
  --ms-semanticColors-defaultStateBackground: {{ dark_background }} !important;
  --ms-semanticColors-bodyBackgroundChecked: {{ selection_background }} !important;
  --ms-semanticColors-buttonBackgroundPressed: {{ selection_background }} !important;
  --ms-semanticColors-buttonBackgroundChecked: {{ selection_background }} !important;
  --ms-semanticColors-buttonBackgroundCheckedHovered: {{ selection_background }} !important;
  --ms-semanticColors-listHeaderBackgroundPressed: {{ selection_background }} !important;
  --ms-semanticColors-menuItemBackgroundChecked: {{ selection_background }} !important;
  --ms-semanticColors-menuItemBackgroundPressed: {{ selection_background }} !important;
  --ms-semanticColors-listItemBackgroundChecked: {{ selection_background }} !important;
  --ms-semanticColors-listItemBackgroundCheckedHovered: {{ selection_background }} !important;
  --ms-semanticColors-bodyDivider: var(--omarchy-divider) !important;
  --ms-semanticColors-bodyFrameDivider: var(--omarchy-divider) !important;
  --ms-semanticColors-variantBorder: var(--omarchy-divider) !important;
  --ms-semanticColors-menuDivider: var(--omarchy-divider) !important;
  --ms-semanticColors-buttonBorderDisabled: var(--omarchy-divider) !important;
  --ms-semanticColors-disabledBorder: var(--omarchy-divider) !important;
  --ms-semanticColors-variantBorderHovered: {{ muted }} !important;
  --ms-semanticColors-buttonBorder: {{ muted }} !important;
  --ms-semanticColors-inputBorder: {{ muted }} !important;
  --ms-semanticColors-smallInputBorder: {{ muted }} !important;
  --ms-semanticColors-inputBorderHovered: {{ muted }} !important;
  --ms-semanticColors-disabledText: {{ muted }} !important;
  --ms-semanticColors-disabledSubtext: {{ muted }} !important;
  --ms-semanticColors-disabledBodyText: {{ muted }} !important;
  --ms-semanticColors-disabledBodySubtext: {{ muted }} !important;
  --ms-semanticColors-inputPlaceholderText: {{ muted }} !important;
  --ms-semanticColors-buttonTextDisabled: {{ muted }} !important;
  --ms-semanticColors-primaryButtonTextDisabled: {{ muted }} !important;
  --ms-semanticColors-inputIconDisabled: {{ muted }} !important;
  --ms-semanticColors-bodyText: {{ light_foreground }} !important;
  --ms-semanticColors-bodySubtext: {{ light_foreground }} !important;
  --ms-semanticColors-listText: {{ light_foreground }} !important;
  --ms-semanticColors-buttonText: {{ light_foreground }} !important;
  --ms-semanticColors-actionLink: {{ light_foreground }} !important;
  --ms-semanticColors-menuItemText: {{ light_foreground }} !important;
  --ms-semanticColors-inputText: {{ light_foreground }} !important;
  --ms-semanticColors-bodyTextChecked: {{ foreground }} !important;
  --ms-semanticColors-listTextColor: {{ foreground }} !important;
  --ms-semanticColors-messageText: {{ foreground }} !important;
  --ms-semanticColors-buttonTextChecked: {{ foreground }} !important;
  --ms-semanticColors-buttonTextHovered: {{ foreground }} !important;
  --ms-semanticColors-buttonTextPressed: {{ foreground }} !important;
  --ms-semanticColors-buttonTextCheckedHovered: {{ foreground }} !important;
  --ms-semanticColors-actionLinkHovered: {{ foreground }} !important;
  --ms-semanticColors-menuItemTextHovered: {{ foreground }} !important;
  --ms-semanticColors-inputTextHovered: {{ foreground }} !important;
  --ms-semanticColors-focusBorder: {{ foreground }} !important;
  --ms-semanticColors-link: {{ accent }} !important;
  --ms-semanticColors-menuHeader: {{ accent }} !important;
  --ms-semanticColors-menuIcon: {{ accent }} !important;
  --ms-semanticColors-inputIcon: {{ accent }} !important;
  --ms-semanticColors-inputBackgroundChecked: {{ accent }} !important;
  --ms-semanticColors-inputFocusBorderAlt: {{ accent }} !important;
  --ms-semanticColors-primaryButtonBackground: {{ accent }} !important;
  --ms-semanticColors-accentButtonBackground: {{ accent }} !important;
  --ms-semanticColors-linkHovered: color-mix(in srgb, {{ accent }} 85%, {{ foreground }}) !important;
  --ms-semanticColors-inputIconHovered: color-mix(in srgb, {{ accent }} 85%, {{ foreground }}) !important;
  --ms-semanticColors-inputBackgroundCheckedHovered: color-mix(in srgb, {{ accent }} 85%, {{ foreground }}) !important;
  --ms-semanticColors-primaryButtonBackgroundHovered: color-mix(in srgb, {{ accent }} 85%, {{ foreground }}) !important;
  --ms-semanticColors-primaryButtonBackgroundPressed: color-mix(in srgb, {{ accent }} 85%, {{ foreground }}) !important;
  --ms-semanticColors-primaryButtonText: var(--omarchy-on-accent) !important;
  --ms-semanticColors-primaryButtonTextHovered: var(--omarchy-on-accent) !important;
  --ms-semanticColors-primaryButtonTextPressed: var(--omarchy-on-accent) !important;
  --ms-semanticColors-accentButtonText: var(--omarchy-on-accent) !important;
  --ms-semanticColors-inputForegroundChecked: var(--omarchy-on-accent) !important;
  --ms-semanticColors-inputPlaceholderBackgroundChecked: color-mix(in srgb, {{ accent }} 16%, {{ background }}) !important;
}
:is(html, body)[class*="teamsFiles"],
html[class*="teamsFiles"] > body,
html[class*="teamsFiles"] [class*="od3Background_"] {
  background-color: transparent !important;
}
html[class*="teamsFiles"] .leftNav {
  background-color: rgb(from {{ dark_background }} r g b / var(--teams-sidebar-opacity)) !important;
  --colorNeutralStroke2: rgb(from {{ foreground }} r g b / 0.12) !important;
  --colorNeutralStrokeSubtle: rgb(from {{ foreground }} r g b / 0.12) !important;
}
html[class*="teamsFiles"] .leftNav ~ [class^="core_"] {
  background-color: {{ background }} !important;
}
/* "OneDrive" follows the pinned toggle, back and forward, on their line. */
html[class*="teamsFiles"] [class*="leftNavHeader_"] {
  padding-left: 116px !important;
}
html[class*="teamsFiles"] [class*="leftNavHeaderText_"] {
  padding: 18px 0 0 12px !important;
}
/* Row lines use the palette's lighter neutral, which is also a hover fill and
   so maps to a lighter background; give resting rows the divider instead. */
html[class*="teamsFiles"] .odspSpartanList [role="row"]:not(:hover, [aria-selected="true"]) {
  border-color: var(--omarchy-divider) !important;
}
/* The sticky Recent / filter bar sits on the page background. */
html[class*="teamsFiles"] .action-row-container {
  background-color: {{ background }} !important;
}

/* Copilot: Fluent 9, so the token map themes it; only the layout is set here. */
:is(html, body):has(#m365-copilot-app-layout-root),
#m365-copilot-app-layout-root {
  background-color: transparent !important;
}
/* Copilot paints the drawer with !important inside a cascade layer, which beats
   any unlayered !important, so clear the variable that rule reads instead. */
#m365-copilot-app-layout-root .fai-CopilotNavDrawer {
  --m365-copilot-canvas-background: transparent !important;
}
#m365-copilot-app-layout-main div:has(> .fai-CopilotNavDrawer) {
  background-color: rgb(from {{ dark_background }} r g b / var(--teams-sidebar-opacity)) !important;
  --colorNeutralStroke2: rgb(from {{ foreground }} r g b / 0.12) !important;
  --colorNeutralStrokeSubtle: rgb(from {{ foreground }} r g b / 0.12) !important;
}
#m365-copilot-chats-section > div:first-child {
  background-color: transparent !important;
}
#m365-copilot-app-layout-content {
  background-color: {{ background }} !important;
}
/* Copilot's own collapse button follows the pinned toggle, back and forward
   (the header's padding is also layered !important, so its row is moved). */
.fai-CopilotNavDrawerHeader > div {
  margin-inline-start: 108px !important;
}
/* The expand button waits behind the open drawer, which no longer hides it. */
[data-testid="expand-button"]:has(~ .fai-CopilotNavDrawer) {
  visibility: hidden !important;
}
