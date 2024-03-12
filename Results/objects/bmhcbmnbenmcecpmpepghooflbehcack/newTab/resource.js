// KEY CODE
const KEY_CODE_ARROW_DOWN = 40;
const KEY_CODE_ARROW_UP = 38;

// Images
const RANDOM_THUMBNAIL = [
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjcyIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI3MiAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNzIiIGhlaWdodD0iMTYwIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIgMCkiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl80NDZfNjQxKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzQ0Nl82NDEiIHgxPSIyNzIiIHkxPSI4MCIgeDI9IjMxLjAyMTciIHkyPSIxNTMuNzM5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGMEJBQ0EiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkNDQkI3Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjcyIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI3MiAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNzIiIGhlaWdodD0iMTYwIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIgMCkiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl80NDZfMTA3NykiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl80NDZfMTA3NyIgeDE9IjI3MiIgeTE9IjgwIiB4Mj0iMzEuMDIxNyIgeTI9IjE1My43MzkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0Y1Q0VCMSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGM0U5QjQiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjcyIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI3MiAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNzIiIGhlaWdodD0iMTYwIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIgMCkiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl80NDZfNjM3KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzQ0Nl82MzciIHgxPSIyNzIiIHkxPSI4MCIgeDI9IjMxLjAyMTciIHkyPSIxNTMuNzM5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNFOEVBOTUiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQzlFQ0IzIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjcyIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI3MiAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNzIiIGhlaWdodD0iMTYwIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIgMCkiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl80NDZfNjQ5KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzQ0Nl82NDkiIHgxPSIyNzIiIHkxPSI4MCIgeDI9IjMxLjAyMTciIHkyPSIxNTMuNzM5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNBOUVEQzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQjNEN0VDIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjcyIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI3MiAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNzIiIGhlaWdodD0iMTYwIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIgMCkiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl80NDZfNjMyKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzQ0Nl82MzIiIHgxPSIyNzIiIHkxPSI4MCIgeDI9IjMxLjAyMTciIHkyPSIxNTMuNzM5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNCM0QxRUQiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQzdCRUUwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjcyIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI3MiAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNzIiIGhlaWdodD0iMTYwIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyNzIgMCkiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl80NDZfNjUzKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzQ0Nl82NTMiIHgxPSIyNzIiIHkxPSI4MCIgeDI9IjMxLjAyMTciIHkyPSIxNTMuNzM5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNEN0JGRTYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRTBCRUNFIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
];
const DEFAULT_FAVICON_LIGHT =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggb3BhY2l0eT0iMC43IiBkPSJNNi45OTMgMEMzLjEyOSAwIDAgMy4xMzYgMCA3QzAgMTAuODY0IDMuMTI5IDE0IDYuOTkzIDE0QzEwLjg2NCAxNCAxNCAxMC44NjQgMTQgN0MxNCAzLjEzNiAxMC44NjQgMCA2Ljk5MyAwWk0xMS44NDQgNC4ySDkuNzc5QzkuNTU1IDMuMzI1IDkuMjMzIDIuNDg1IDguODEzIDEuNzA4QzEwLjEwMSAyLjE0OSAxMS4xNzIgMy4wNDUgMTEuODQ0IDQuMlpNNyAxLjQyOEM3LjU4MSAyLjI2OCA4LjAzNiAzLjE5OSA4LjMzNyA0LjJINS42NjNDNS45NjQgMy4xOTkgNi40MTkgMi4yNjggNyAxLjQyOFpNMS41ODIgOC40QzEuNDcgNy45NTIgMS40IDcuNDgzIDEuNCA3QzEuNCA2LjUxNyAxLjQ3IDYuMDQ4IDEuNTgyIDUuNkgzLjk0OEMzLjg5MiA2LjA2MiAzLjg1IDYuNTI0IDMuODUgN0MzLjg1IDcuNDc2IDMuODkyIDcuOTM4IDMuOTQ4IDguNEgxLjU4MlpNMi4xNTYgOS44SDQuMjIxQzQuNDQ1IDEwLjY3NSA0Ljc2NyAxMS41MTUgNS4xODcgMTIuMjkyQzMuODk5IDExLjg1MSAyLjgyOCAxMC45NjIgMi4xNTYgOS44Wk00LjIyMSA0LjJIMi4xNTZDMi44MjggMy4wMzggMy44OTkgMi4xNDkgNS4xODcgMS43MDhDNC43NjcgMi40ODUgNC40NDUgMy4zMjUgNC4yMjEgNC4yWk03IDEyLjU3MkM2LjQxOSAxMS43MzIgNS45NjQgMTAuODAxIDUuNjYzIDkuOEg4LjMzN0M4LjAzNiAxMC44MDEgNy41ODEgMTEuNzMyIDcgMTIuNTcyWk04LjYzOCA4LjRINS4zNjJDNS4yOTkgNy45MzggNS4yNSA3LjQ3NiA1LjI1IDdDNS4yNSA2LjUyNCA1LjI5OSA2LjA1NSA1LjM2MiA1LjZIOC42MzhDOC43MDEgNi4wNTUgOC43NSA2LjUyNCA4Ljc1IDdDOC43NSA3LjQ3NiA4LjcwMSA3LjkzOCA4LjYzOCA4LjRaTTguODEzIDEyLjI5MkM5LjIzMyAxMS41MTUgOS41NTUgMTAuNjc1IDkuNzc5IDkuOEgxMS44NDRDMTEuMTcyIDEwLjk1NSAxMC4xMDEgMTEuODUxIDguODEzIDEyLjI5MlpNMTAuMDUyIDguNEMxMC4xMDggNy45MzggMTAuMTUgNy40NzYgMTAuMTUgN0MxMC4xNSA2LjUyNCAxMC4xMDggNi4wNjIgMTAuMDUyIDUuNkgxMi40MThDMTIuNTMgNi4wNDggMTIuNiA2LjUxNyAxMi42IDdDMTIuNiA3LjQ4MyAxMi41MyA3Ljk1MiAxMi40MTggOC40SDEwLjA1MloiIGZpbGw9IiM1MDU1NUMiLz4KPC9zdmc+Cg==';

const DEFAULT_FAVICON_DARK =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggb3BhY2l0eT0iMC43IiBkPSJNNi45OTMgMEMzLjEyOSAwIDAgMy4xMzYgMCA3QzAgMTAuODY0IDMuMTI5IDE0IDYuOTkzIDE0QzEwLjg2NCAxNCAxNCAxMC44NjQgMTQgN0MxNCAzLjEzNiAxMC44NjQgMCA2Ljk5MyAwWk0xMS44NDQgNC4ySDkuNzc5QzkuNTU1IDMuMzI1IDkuMjMzIDIuNDg1IDguODEzIDEuNzA4QzEwLjEwMSAyLjE0OSAxMS4xNzIgMy4wNDUgMTEuODQ0IDQuMlpNNyAxLjQyOEM3LjU4MSAyLjI2OCA4LjAzNiAzLjE5OSA4LjMzNyA0LjJINS42NjNDNS45NjQgMy4xOTkgNi40MTkgMi4yNjggNyAxLjQyOFpNMS41ODIgOC40QzEuNDcgNy45NTIgMS40IDcuNDgzIDEuNCA3QzEuNCA2LjUxNyAxLjQ3IDYuMDQ4IDEuNTgyIDUuNkgzLjk0OEMzLjg5MiA2LjA2MiAzLjg1IDYuNTI0IDMuODUgN0MzLjg1IDcuNDc2IDMuODkyIDcuOTM4IDMuOTQ4IDguNEgxLjU4MlpNMi4xNTYgOS44SDQuMjIxQzQuNDQ1IDEwLjY3NSA0Ljc2NyAxMS41MTUgNS4xODcgMTIuMjkyQzMuODk5IDExLjg1MSAyLjgyOCAxMC45NjIgMi4xNTYgOS44Wk00LjIyMSA0LjJIMi4xNTZDMi44MjggMy4wMzggMy44OTkgMi4xNDkgNS4xODcgMS43MDhDNC43NjcgMi40ODUgNC40NDUgMy4zMjUgNC4yMjEgNC4yWk03IDEyLjU3MkM2LjQxOSAxMS43MzIgNS45NjQgMTAuODAxIDUuNjYzIDkuOEg4LjMzN0M4LjAzNiAxMC44MDEgNy41ODEgMTEuNzMyIDcgMTIuNTcyWk04LjYzOCA4LjRINS4zNjJDNS4yOTkgNy45MzggNS4yNSA3LjQ3NiA1LjI1IDdDNS4yNSA2LjUyNCA1LjI5OSA2LjA1NSA1LjM2MiA1LjZIOC42MzhDOC43MDEgNi4wNTUgOC43NSA2LjUyNCA4Ljc1IDdDOC43NSA3LjQ3NiA4LjcwMSA3LjkzOCA4LjYzOCA4LjRaTTguODEzIDEyLjI5MkM5LjIzMyAxMS41MTUgOS41NTUgMTAuNjc1IDkuNzc5IDkuOEgxMS44NDRDMTEuMTcyIDEwLjk1NSAxMC4xMDEgMTEuODUxIDguODEzIDEyLjI5MlpNMTAuMDUyIDguNEMxMC4xMDggNy45MzggMTAuMTUgNy40NzYgMTAuMTUgN0MxMC4xNSA2LjUyNCAxMC4xMDggNi4wNjIgMTAuMDUyIDUuNkgxMi40MThDMTIuNTMgNi4wNDggMTIuNiA2LjUxNyAxMi42IDdDMTIuNiA3LjQ4MyAxMi41MyA3Ljk1MiAxMi40MTggOC40SDEwLjA1MloiIGZpbGw9IiNDMkM2Q0UiLz4KPC9zdmc+Cg==';

// Article Count
const NUM_OF_CONTENTS_LOADED = 40;
const MAX_NUM_OF_CONTENTS_SHOWN = 13;

const getRandomCount = () => {
  return Math.floor(Math.random() * 5);
};

const createNewTabBelt = () => `
  <section class="LNewTabBelt">
    <div class="LNewTabBelt__text">${localize(
      'Press Ctrl(cmd)+Shift+B to bring your bookmark bar back here.',
    )}</div>
    <button class="LNewTabBelt__closeBtn"></button>
  </section>
`;

const createAutoComplete = (completeKeyword) => {
  const searchIcon =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjIwMDUgMTAuMDAwNUgxMC41Njg1TDEwLjM0NDUgOS43ODQ1MUMxMS4zMDQ1IDguNjY0NTEgMTEuODAwNSA3LjEzNjUxIDExLjUyODUgNS41MTI1MUMxMS4xNTI1IDMuMjg4NTEgOS4yOTY0NSAxLjUxMjUxIDcuMDU2NDUgMS4yNDA1MUMzLjY3MjQ1IDAuODI0NTEzIDAuODI0NDUyIDMuNjcyNTEgMS4yNDA0NSA3LjA1NjUxQzEuNTEyNDUgOS4yOTY1MSAzLjI4ODQ1IDExLjE1MjUgNS41MTI0NSAxMS41Mjg1QzcuMTM2NDUgMTEuODAwNSA4LjY2NDQ1IDExLjMwNDUgOS43ODQ0NSAxMC4zNDQ1TDEwLjAwMDUgMTAuNTY4NVYxMS4yMDA1TDEzLjQwMDUgMTQuNjAwNUMxMy43Mjg1IDE0LjkyODUgMTQuMjY0NSAxNC45Mjg1IDE0LjU5MjUgMTQuNjAwNUMxNC45MjA1IDE0LjI3MjUgMTQuOTIwNSAxMy43MzY1IDE0LjU5MjUgMTMuNDA4NUwxMS4yMDA1IDEwLjAwMDVaTTYuNDAwNDUgMTAuMDAwNUM0LjQwODQ1IDEwLjAwMDUgMi44MDA0NSA4LjM5MjUxIDIuODAwNDUgNi40MDA1MUMyLjgwMDQ1IDQuNDA4NTEgNC40MDg0NSAyLjgwMDUxIDYuNDAwNDUgMi44MDA1MUM4LjM5MjQ1IDIuODAwNTEgMTAuMDAwNSA0LjQwODUxIDEwLjAwMDUgNi40MDA1MUMxMC4wMDA1IDguMzkyNTEgOC4zOTI0NSAxMC4wMDA1IDYuNDAwNDUgMTAuMDAwNVoiIGZpbGw9IiM5NTlDQTYiLz4KPC9zdmc+Cg==';
  const searchIconDark =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjIwMDUgMTAuMDAwNUgxMC41Njg1TDEwLjM0NDUgOS43ODQ0NUMxMS4zMDQ1IDguNjY0NDUgMTEuODAwNSA3LjEzNjQ1IDExLjUyODUgNS41MTI0NUMxMS4xNTI1IDMuMjg4NDUgOS4yOTY0NSAxLjUxMjQ1IDcuMDU2NDUgMS4yNDA0NUMzLjY3MjQ1IDAuODI0NDUyIDAuODI0NDUyIDMuNjcyNDUgMS4yNDA0NSA3LjA1NjQ1QzEuNTEyNDUgOS4yOTY0NSAzLjI4ODQ1IDExLjE1MjUgNS41MTI0NSAxMS41Mjg1QzcuMTM2NDUgMTEuODAwNSA4LjY2NDQ1IDExLjMwNDUgOS43ODQ0NSAxMC4zNDQ1TDEwLjAwMDUgMTAuNTY4NFYxMS4yMDA0TDEzLjQwMDUgMTQuNjAwNEMxMy43Mjg1IDE0LjkyODQgMTQuMjY0NSAxNC45Mjg0IDE0LjU5MjUgMTQuNjAwNEMxNC45MjA1IDE0LjI3MjQgMTQuOTIwNSAxMy43MzY1IDE0LjU5MjUgMTMuNDA4NUwxMS4yMDA1IDEwLjAwMDVaTTYuNDAwNDUgMTAuMDAwNUM0LjQwODQ1IDEwLjAwMDUgMi44MDA0NSA4LjM5MjQ1IDIuODAwNDUgNi40MDA0NUMyLjgwMDQ1IDQuNDA4NDUgNC40MDg0NSAyLjgwMDQ1IDYuNDAwNDUgMi44MDA0NUM4LjM5MjQ1IDIuODAwNDUgMTAuMDAwNSA0LjQwODQ1IDEwLjAwMDUgNi40MDA0NUMxMC4wMDA1IDguMzkyNDUgOC4zOTI0NSAxMC4wMDA1IDYuNDAwNDUgMTAuMDAwNVoiIGZpbGw9IiNDMkM2Q0UiLz4KPC9zdmc+Cg==';
  return `
    <li class="autoComplete__list">
      <img class="autoComplete__icon" src=${searchIcon} />
      <img class="autoComplete__icon darkMode" src=${searchIconDark} />
      ${completeKeyword}
    </li>
  `;
};

const createShortcut = (shortcut) => {
  // shortcut - 파비콘 가져오기
  const shortcutFaviconSize = 256;
  const shortcutUrl = shortcut.url;
  const shortcutFavicon = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${shortcutUrl}&size=${shortcutFaviconSize}`;

  return `
    <li class="Shortcut__list">
    <button class="Shortcut__favicon">
      <div class="Shortcut__icon">
        <img
        class="Shortcut__faviconImg"
        src=${shortcutFavicon}
        alt=${shortcut.name}
        />
      </div>
    </button>
    <div class="Shortcut__name">${shortcut.name}</div>
    </li>`;
};

const defaultShortcutOriginal = [
  {
    name: 'Google',
    url: 'https://www.google.com',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com',
  },
  {
    name: 'Medium',
    url: 'https://medium.com',
  },
  {
    name: '',
    url: '',
  },
  {
    name: '',
    url: '',
  },
];

const createShortcutEditBtn = () => {
  return `
      <p class="Shortcut__editBtn">
        <img
          class="EditBtn__icon"
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMyAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMTAuNjRWMTIuNjY2N0MwIDEyLjg1MzMgMC4xNDY2NjcgMTMgMC4zMzMzMzMgMTNIMi4zNkMyLjQ0NjY3IDEzIDIuNTMzMzMgMTIuOTY2NyAyLjU5MzMzIDEyLjlMOS44NzMzMyA1LjYyNjY1TDcuMzczMzMgMy4xMjY2NkwwLjEgMTAuNEMwLjAzMzMzMzQgMTAuNDY2NyAwIDEwLjU0NjcgMCAxMC42NFpNMTEuODA2NyAzLjY5MzMyQzEyLjA2NjcgMy40MzMzMiAxMi4wNjY3IDMuMDEzMzIgMTEuODA2NyAyLjc1MzMyTDEwLjI0NjcgMS4xOTMzMkM5Ljk4NjY3IDAuOTMzMzIyIDkuNTY2NjcgMC45MzMzMjIgOS4zMDY2NyAxLjE5MzMyTDguMDg2NjcgMi40MTMzMkwxMC41ODY3IDQuOTEzMzJMMTEuODA2NyAzLjY5MzMyWiIgZmlsbD0iIzk1OUNBNiIvPgo8L3N2Zz4K"
          alt="shortcut edit button"
        />
        <img
          class="EditBtn__icon darkMode"
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMyAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMTAuNjRWMTIuNjY2NkMwIDEyLjg1MzMgMC4xNDY2NjcgMTMgMC4zMzMzMzMgMTNIMi4zNkMyLjQ0NjY3IDEzIDIuNTMzMzMgMTIuOTY2NiAyLjU5MzMzIDEyLjlMOS44NzMzMyA1LjYyNjYyTDcuMzczMzMgMy4xMjY2MkwwLjEgMTAuNEMwLjAzMzMzMzQgMTAuNDY2NiAwIDEwLjU0NjYgMCAxMC42NFpNMTEuODA2NyAzLjY5MzI5QzEyLjA2NjcgMy40MzMyOSAxMi4wNjY3IDMuMDEzMjkgMTEuODA2NyAyLjc1MzI5TDEwLjI0NjcgMS4xOTMyOUM5Ljk4NjY3IDAuOTMzMjkxIDkuNTY2NjcgMC45MzMyOTEgOS4zMDY2NyAxLjE5MzI5TDguMDg2NjcgMi40MTMyOUwxMC41ODY3IDQuOTEzMjlMMTEuODA2NyAzLjY5MzI5WiIgZmlsbD0iI0YyRjNGNyIvPgo8L3N2Zz4K"
          alt="shortcut edit button"
        />
      </p>
    `;
};

const createEditModal = () => `<div class="EditShortCut__modal__wrap">
  <div class="EditShortCut__modal" data-shortcut-index="">
    <button class="EditShortCut__modal__closeBtn">
      <img
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNSAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5LjI5ODMgNS43MUMxOC45MDgzIDUuMzIgMTguMjc4MyA1LjMyIDE3Ljg4ODMgNS43MUwxMi45OTgzIDEwLjU5TDguMTA4MjYgNS43QzcuNzE4MjYgNS4zMSA3LjA4ODI2IDUuMzEgNi42OTgyNiA1LjdDNi4zMDgyNiA2LjA5IDYuMzA4MjYgNi43MiA2LjY5ODI2IDcuMTFMMTEuNTg4MyAxMkw2LjY5ODI2IDE2Ljg5QzYuMzA4MjYgMTcuMjggNi4zMDgyNiAxNy45MSA2LjY5ODI2IDE4LjNDNy4wODgyNiAxOC42OSA3LjcxODI2IDE4LjY5IDguMTA4MjYgMTguM0wxMi45OTgzIDEzLjQxTDE3Ljg4ODMgMTguM0MxOC4yNzgzIDE4LjY5IDE4LjkwODMgMTguNjkgMTkuMjk4MyAxOC4zQzE5LjY4ODMgMTcuOTEgMTkuNjg4MyAxNy4yOCAxOS4yOTgzIDE2Ljg5TDE0LjQwODMgMTJMMTkuMjk4MyA3LjExQzE5LjY3ODMgNi43MyAxOS42NzgzIDYuMDkgMTkuMjk4MyA1LjcxWiIgZmlsbD0iIzMzMzczRCIvPgo8L3N2Zz4K"
        alt="close"
        class="EditShortCut__modal__closeImg"
      />
    </button>
    <h3 class="EditShortCut__modal__title">${localize('Add Shortcut')}</h3>
    <form class="EditShortCut__modal__form">
      <section class="EditShortCut__modal__section">
        <label for="url" class="EditShortCut__modal__label">URL</label>
        <div class="EditShortCut__modal__inputBox">
          <input
            type="text"
            name="url"
            placeholder="URL"
            spellcheck="false"
            autocomplete="off"
            class="EditShortCut__modal__input url"
            value=""
            autofocus
          />
          <button type="button" class="EditShortCut__modal__clearBtn url">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMS41QzQuODUyNSAxLjUgMS41IDQuODUyNSAxLjUgOUMxLjUgMTMuMTQ3NSA0Ljg1MjUgMTYuNSA5IDE2LjVDMTMuMTQ3NSAxNi41IDE2LjUgMTMuMTQ3NSAxNi41IDlDMTYuNSA0Ljg1MjUgMTMuMTQ3NSAxLjUgOSAxLjVaTTEyLjIyNSAxMi4yMjVDMTEuOTMyNSAxMi41MTc1IDExLjQ2IDEyLjUxNzUgMTEuMTY3NSAxMi4yMjVMOSAxMC4wNTc1TDYuODMyNSAxMi4yMjVDNi41NCAxMi41MTc1IDYuMDY3NSAxMi41MTc1IDUuNzc1IDEyLjIyNUM1LjQ4MjUgMTEuOTMyNSA1LjQ4MjUgMTEuNDYgNS43NzUgMTEuMTY3NUw3Ljk0MjUgOUw1Ljc3NSA2LjgzMjVDNS40ODI1IDYuNTQgNS40ODI1IDYuMDY3NSA1Ljc3NSA1Ljc3NUM2LjA2NzUgNS40ODI1IDYuNTQgNS40ODI1IDYuODMyNSA1Ljc3NUw5IDcuOTQyNUwxMS4xNjc1IDUuNzc1QzExLjQ2IDUuNDgyNSAxMS45MzI1IDUuNDgyNSAxMi4yMjUgNS43NzVDMTIuNTE3NSA2LjA2NzUgMTIuNTE3NSA2LjU0IDEyLjIyNSA2LjgzMjVMMTAuMDU3NSA5TDEyLjIyNSAxMS4xNjc1QzEyLjUxIDExLjQ1MjUgMTIuNTEgMTEuOTMyNSAxMi4yMjUgMTIuMjI1WiIgZmlsbD0iI0MyQzZDRSIvPgo8L3N2Zz4K"
              alt="clear"
              class="EditShortCut__modal__clearImg"
            />
          </button>
        </div>
        <div class="EditShortCut__modal__ErrorMsg__box">
          <div class="EditShortCut__modal__ErrorMsg urlFormat">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuMzMzNSA0LjY2NjY4SDguNjY2ODNWNi4wMDAwMUg3LjMzMzVWNC42NjY2OFpNNy4zMzM1IDcuMzMzMzRIOC42NjY4M1YxMS4zMzMzSDcuMzMzNVY3LjMzMzM0Wk04LjAwMDE2IDEuMzMzMzRDNC4zMjAxNiAxLjMzMzM0IDEuMzMzNSA0LjMyMDAxIDEuMzMzNSA4LjAwMDAxQzEuMzMzNSAxMS42OCA0LjMyMDE2IDE0LjY2NjcgOC4wMDAxNiAxNC42NjY3QzExLjY4MDIgMTQuNjY2NyAxNC42NjY4IDExLjY4IDE0LjY2NjggOC4wMDAwMUMxNC42NjY4IDQuMzIwMDEgMTEuNjgwMiAxLjMzMzM0IDguMDAwMTYgMS4zMzMzNFpNOC4wMDAxNiAxMy4zMzMzQzUuMDYwMTYgMTMuMzMzMyAyLjY2NjgzIDEwLjk0IDIuNjY2ODMgOC4wMDAwMUMyLjY2NjgzIDUuMDYwMDEgNS4wNjAxNiAyLjY2NjY4IDguMDAwMTYgMi42NjY2OEMxMC45NDAyIDIuNjY2NjggMTMuMzMzNSA1LjA2MDAxIDEzLjMzMzUgOC4wMDAwMUMxMy4zMzM1IDEwLjk0IDEwLjk0MDIgMTMuMzMzMyA4LjAwMDE2IDEzLjMzMzNaIiBmaWxsPSIjRkY1NDU0Ii8+Cjwvc3ZnPgo="
              alt="info"
              class="EditShortCut__modal__ErrorIcon"
            />
            <span class="EditShortCut__modal__ErrorText"
              >${localize('Please enter a valid URL')}</span
            >
          </div>
      </section>
      <section class="EditShortCut__modal__section">
        <label for="name" class="EditShortCut__modal__label">${localize('Shortcut_Name')}</label>
        <div class="EditShortCut__modal__inputBox">
          <input
            type="text"
            name="name"
            placeholder="${localize('Shortcut_Name')}"
            spellcheck="false"
            autocomplete="off"
            class="EditShortCut__modal__input name"
            value=""
          />
          <button type="button" class="EditShortCut__modal__clearBtn name">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMS41QzQuODUyNSAxLjUgMS41IDQuODUyNSAxLjUgOUMxLjUgMTMuMTQ3NSA0Ljg1MjUgMTYuNSA5IDE2LjVDMTMuMTQ3NSAxNi41IDE2LjUgMTMuMTQ3NSAxNi41IDlDMTYuNSA0Ljg1MjUgMTMuMTQ3NSAxLjUgOSAxLjVaTTEyLjIyNSAxMi4yMjVDMTEuOTMyNSAxMi41MTc1IDExLjQ2IDEyLjUxNzUgMTEuMTY3NSAxMi4yMjVMOSAxMC4wNTc1TDYuODMyNSAxMi4yMjVDNi41NCAxMi41MTc1IDYuMDY3NSAxMi41MTc1IDUuNzc1IDEyLjIyNUM1LjQ4MjUgMTEuOTMyNSA1LjQ4MjUgMTEuNDYgNS43NzUgMTEuMTY3NUw3Ljk0MjUgOUw1Ljc3NSA2LjgzMjVDNS40ODI1IDYuNTQgNS40ODI1IDYuMDY3NSA1Ljc3NSA1Ljc3NUM2LjA2NzUgNS40ODI1IDYuNTQgNS40ODI1IDYuODMyNSA1Ljc3NUw5IDcuOTQyNUwxMS4xNjc1IDUuNzc1QzExLjQ2IDUuNDgyNSAxMS45MzI1IDUuNDgyNSAxMi4yMjUgNS43NzVDMTIuNTE3NSA2LjA2NzUgMTIuNTE3NSA2LjU0IDEyLjIyNSA2LjgzMjVMMTAuMDU3NSA5TDEyLjIyNSAxMS4xNjc1QzEyLjUxIDExLjQ1MjUgMTIuNTEgMTEuOTMyNSAxMi4yMjUgMTIuMjI1WiIgZmlsbD0iI0MyQzZDRSIvPgo8L3N2Zz4K"
              alt="clear"
              class="EditShortCut__modal__clearImg"
            />
          </button>
        </div>
      </section>
      <section class="EditShortCut__modal__btnBox">
        <button type="button" class="EditShortCut__modal__deleteBtn">
          <img
            class="EditShortCut__modal__deleteIcon"
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYgMTlDNiAyMC4xIDYuOSAyMSA4IDIxSDE2QzE3LjEgMjEgMTggMjAuMSAxOCAxOVY5QzE4IDcuOSAxNy4xIDcgMTYgN0g4QzYuOSA3IDYgNy45IDYgOVYxOVpNMTggNEgxNS41TDE0Ljc5IDMuMjlDMTQuNjEgMy4xMSAxNC4zNSAzIDE0LjA5IDNIOS45MUM5LjY1IDMgOS4zOSAzLjExIDkuMjEgMy4yOUw4LjUgNEg2QzUuNDUgNCA1IDQuNDUgNSA1QzUgNS41NSA1LjQ1IDYgNiA2SDE4QzE4LjU1IDYgMTkgNS41NSAxOSA1QzE5IDQuNDUgMTguNTUgNCAxOCA0WiIgZmlsbD0iI0ZGNTQ1NCIvPgo8L3N2Zz4K"
            alt="delete"
          />
          ${localize('Delete')}
        </button>
        <div class="EditShortCut__modal__confirmBtn">
          <button type="button" class="EditShortCut__modal__cancelBtn">${localize(
            'Cancel',
          )}</button>
          <button type="submit" class="EditShortCut__modal__submitBtn success">${localize(
            'Save',
          )}</button>
        </div>
      </section>
    </form>
  </div>
</div>`;

const createRecommendedArticle = (content, contentTitle, contentDescription, contentUrl) => {
  return `
    <article class="RecommendedArticle forYou">
      <div class="RecommendedArticle__bookmark">
        <img class="Article__bookmark" alt="article bookmark" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2Ljk5OTkgM0g2Ljk5OTk5QzUuODk5OTkgMyA1IDMuOSA1IDVWMjFMMTIgMThMMTguOTk5OSAyMVY1QzE4Ljk5OTkgMy45IDE4LjA5OTkgMyAxNi45OTk5IDNaTTE2Ljk5OTkgMThMMTIgMTUuODJMNi45OTk5OSAxOFY2QzYuOTk5OTkgNS40NSA3LjQ0OTk4IDUgNy45OTk5OCA1SDE1Ljk5OTlDMTYuNTQ5OSA1IDE2Ljk5OTkgNS40NSAxNi45OTk5IDZWMThaIiBmaWxsPSIjOTU5Q0E2Ii8+Cjwvc3ZnPgo=" />
        <img class="Article__bookmark darkMode" alt="article bookmark" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2Ljk5OTkgM0g2Ljk5OTk5QzUuODk5OTkgMyA1IDMuOSA1IDVWMjFMMTIgMThMMTguOTk5OSAyMVY1QzE4Ljk5OTkgMy45IDE4LjA5OTkgMyAxNi45OTk5IDNaTTE2Ljk5OTkgMThMMTIgMTUuODJMNi45OTk5OSAxOFY2QzYuOTk5OTkgNS40NSA3LjQ0OTk4IDUgNy45OTk5OCA1SDE1Ljk5OTlDMTYuNTQ5OSA1IDE2Ljk5OTkgNS40NSAxNi45OTk5IDZWMThaIiBmaWxsPSIjQzJDNkNFIi8+Cjwvc3ZnPgo=" />
        <img class="Article__bookmark bookmarked" alt="article bookmark" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3IDNIN0M1LjkgMyA1IDMuOSA1IDVWMjFMMTIgMThMMTkgMjFWNUMxOSAzLjkgMTguMSAzIDE3IDNaIiBmaWxsPSIjMDBDM0NDIi8+Cjwvc3ZnPgo=" />
      </div>
      <a class="RecommendedArticle__Link" href="${content.url}" data-algorithm-id=${
    content.algorithm_id
  } target="_blank">
        <p class="RecommendedArticle__thumbWrap">
          <img class="RecommendedArticle__Thumbnail" alt="article image" src="${content.image_url}"
          />  
        </p>
        <div>
          <h1 class="RecommendedArticle__title">
            ${contentTitle}
          </h1>
          <div class="RecommendedArticle__description">
          ${content.description === null ? '' : contentDescription}
          </div>
          <footer class="RecommendedArticle__footer">
            <div class="RecommendedArticle__footer__info">
              <img class="RecommendedArticle__favicon" alt="favicon image" style="display: none" src="${
                content.favicon_url
              }"/>
              <p class="RecommendedArticle__url">
                ${contentUrl}
              </p>
            </div>
          </footer>
        </div>
      </a>
    </article>`;
};

const createInterestsArticle = (
  content,
  contentTitle,
  contentDescription,
  contentUrl,
  codeName,
) => {
  return `
    <article class="RecommendedArticle ${codeName}">
      <div class="RecommendedArticle__bookmark">
        <img class="Article__bookmark" alt="article bookmark" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2Ljk5OTkgM0g2Ljk5OTk5QzUuODk5OTkgMyA1IDMuOSA1IDVWMjFMMTIgMThMMTguOTk5OSAyMVY1QzE4Ljk5OTkgMy45IDE4LjA5OTkgMyAxNi45OTk5IDNaTTE2Ljk5OTkgMThMMTIgMTUuODJMNi45OTk5OSAxOFY2QzYuOTk5OTkgNS40NSA3LjQ0OTk4IDUgNy45OTk5OCA1SDE1Ljk5OTlDMTYuNTQ5OSA1IDE2Ljk5OTkgNS40NSAxNi45OTk5IDZWMThaIiBmaWxsPSIjOTU5Q0E2Ii8+Cjwvc3ZnPgo=" />
        <img class="Article__bookmark darkMode" alt="article bookmark" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2Ljk5OTkgM0g2Ljk5OTk5QzUuODk5OTkgMyA1IDMuOSA1IDVWMjFMMTIgMThMMTguOTk5OSAyMVY1QzE4Ljk5OTkgMy45IDE4LjA5OTkgMyAxNi45OTk5IDNaTTE2Ljk5OTkgMThMMTIgMTUuODJMNi45OTk5OSAxOFY2QzYuOTk5OTkgNS40NSA3LjQ0OTk4IDUgNy45OTk5OCA1SDE1Ljk5OTlDMTYuNTQ5OSA1IDE2Ljk5OTkgNS40NSAxNi45OTk5IDZWMThaIiBmaWxsPSIjQzJDNkNFIi8+Cjwvc3ZnPgo=" />
        <img class="Article__bookmark bookmarked" alt="article bookmark" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3IDNIN0M1LjkgMyA1IDMuOSA1IDVWMjFMMTIgMThMMTkgMjFWNUMxOSAzLjkgMTguMSAzIDE3IDNaIiBmaWxsPSIjMDBDM0NDIi8+Cjwvc3ZnPgo=" />
      </div>
      <a target="_blank" class="RecommendedArticle__Link" href="${content.url}" data-algorithm-id=${
    content.algorithm_id
  }>
        <p class="RecommendedArticle__thumbWrap">
          <img class="RecommendedArticle__Thumbnail" alt="article image"
            style="display: none"
            src="${content.image_url}"
          />
        </p>
        <div>
          <h1 class="RecommendedArticle__title">
            ${contentTitle}
          </h1>
          <div class="RecommendedArticle__description">
          ${contentDescription === null ? '' : contentDescription}
          </div>
          <footer class="RecommendedArticle__footer">
            <div class="RecommendedArticle__footer__info">
              <img class="RecommendedArticle__favicon" alt="favicon image" style="display: none" src="${
                content.favicon_url
              }"/>
              <p class="RecommendedArticle__url">
                ${contentUrl}
              </p>
            </div>
          </footer>
        </div>
      </a>
    </article>`;
};

const createInterestItem = (imageUrl, interestName) => `
  <li class="LNewTabInterest__item">
    <img class="LNewTabInterest__emoji" src="${imageUrl}" alt="${interestName}"/>
    ${interestName}
  </li>`;
