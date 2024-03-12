// Constant

const MON_TO_SUN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const NUM_OF_DAYS = 28;

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const MONTH = 28 * DAY;

// Selectors

const header = document.querySelector('.L-HighlightStreak__header');
const main = document.querySelector('.L-HighlightStreak__main');
const title = document.querySelector('.L-HighlightStreak__title');

// L10N

const L10NList = [
  'Awesome! 😎',
  'Getting smarter each day! 🤓',
  'The best 🥇',
  'Keep it going! 📈',
  'Great Choice! 👏',
  'Growth of Growth! 🔥',
  'Stretch your legs 👋',
  'Hard work pays off 🪃',
  'Thats a perfect score 💯',
  'Share that awesome highlight 👍',
  '🚀🚀🚀',
];

const getRandomTitleFromL10NList = () => {
  const randomIndex = Math.floor(Math.random() * L10NList.length);
  return L10NList[randomIndex];
};

const updateTitle = (title) => {
  title.innerHTML = localize(getRandomTitleFromL10NList());
};

// Store

const urlStore = () => {
  let url = '';
  return {
    getUrl: () => new URL(url),
    setUrl: (newUrl) => {
      url = newUrl;
    },
  };
};

const { getUrl, setUrl } = urlStore();

const viewEventStore = () => {
  let isViewEventSent = false;
  return {
    checkIsViewEventSent: () => isViewEventSent,
    setIsViewEventSent: (isViewEventSentValue) => {
      isViewEventSent = isViewEventSentValue;
    },
  };
};

const { checkIsViewEventSent, setIsViewEventSent } = viewEventStore();

// Utils

const getDateString = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
};

const getTodayIndexFromDayOfWeek = (dayOfWeek) => {
  switch (dayOfWeek) {
    case 'saturday': {
      return NUM_OF_DAYS - 1;
    }
    case 'friday': {
      return NUM_OF_DAYS - 2;
    }
    case 'thursday': {
      return NUM_OF_DAYS - 3;
    }
    case 'wednesday': {
      return NUM_OF_DAYS - 4;
    }
    case 'tuesday': {
      return NUM_OF_DAYS - 5;
    }
    case 'monday': {
      return NUM_OF_DAYS - 6;
    }
  }
};

const getDayType = (videoHighlightPageCount, textHighlightPageCount) => {
  if (videoHighlightPageCount === 0 && textHighlightPageCount === 0) return 'empty';
  if (videoHighlightPageCount === 0) return 'text';
  if (textHighlightPageCount === 0) return 'video';
  return 'both';
};

const getDayTypeAndTotalCountFromHighlightStat = (highlightStat) => {
  const { videoHighlightPageCount, textHighlightPageCount } = highlightStat;
  return {
    type: getDayType(videoHighlightPageCount, textHighlightPageCount),
    totalCount: videoHighlightPageCount + textHighlightPageCount,
  };
};

const getDayColorFromHighlightStat = (highlightStat) => {
  const { type, totalCount } = getDayTypeAndTotalCountFromHighlightStat(highlightStat);
  if (type === 'empty') return '#F2F3F7';
  if (type === 'text') {
    if (totalCount < 3) return 'rgba(79, 213, 255, 0.4)';
    if (totalCount < 7) return 'rgba(79, 213, 255, 0.6)';
    return 'rgba(79, 213, 255, 1)';
  }
  if (type === 'video') {
    if (totalCount < 3) return 'rgba(255, 229, 0, 0.4)';
    if (totalCount < 7) return 'rgba(255, 229, 0, 0.6)';
    return 'rgba(255, 229, 0, 1)';
  }
  if (type === 'both') {
    if (totalCount < 3) return 'rgba(63, 236, 174, 0.4)';
    if (totalCount < 7) return 'rgba(63, 236, 174, 0.6)';
    return 'rgba(63, 236, 174, 1)';
  }
};

const getHighlightStatisticsForCalendar = (highlightStatistics) => {
  const todayDate = new Date(getDateString(new Date()));

  const highlightStatisticsForCalendar = highlightStatistics
    .filter((highlightStatistic) => new Date(highlightStatistic.date) <= todayDate)
    .reverse();

  return highlightStatisticsForCalendar;
};

// api

const apiGetHighlightStatistics = () => {
  messageToNative('GET_HIGHLIGHT_STATISTICS', {
    startDate: getDateString(new Date(new Date().getTime() - MONTH)),
    endDate: getDateString(new Date(new Date().getTime() + DAY)),
  });
};

const apiOpenHighlightStreakPopover = () => {
  messageToNative('OPEN_HIGHLIGHT_STREAK_POPOVER', {});
};

const apiCloseHighlightStreakPopover = () => {
  messageToNative('CLOSE_HIGHLIGHT_STREAK_POPOVER', {});
};

// Message Receiver

const handleGetHighlightStatistics = (eventMessage) => {
  const { data: highlightStatistics, url } = eventMessage;
  setUrl(url);

  const calendar = document.querySelector('.L-HighlightStreak__calendar');
  const days = [...calendar.querySelectorAll('.L-HighlightStreak__day')];

  const highlightStatisticsForCalendar = getHighlightStatisticsForCalendar(highlightStatistics);
  updateCalendar(days, highlightStatisticsForCalendar);
  addHoverEventToDays(days);
};

const handleOpenHighlightStreakPopover = (eventMessage) => {
  const highlightStreak = document.querySelector('.L-HighlightStreak');
  highlightStreak.classList.add('L-Opened');

  const { isInitialLoad, url } = eventMessage;
  if (isInitialLoad && !checkIsViewEventSent()) {
    setIsViewEventSent(true);
    setUrl(url);
    AMP_VIEW_BE_HIGHLIGHT_STREAK_CALENDAR();
  }
};

const handleCloseHighlightStreakPopover = () => {
  const highlightStreak = document.querySelector('.L-HighlightStreak');
  highlightStreak.classList.remove('L-Opened');
};

/*

Highlight Stat Data - Array of Object

{
  date: '2020-01-01',
  dayOfWeek: 'monday',
  videoHighlightPageCount: 1,
  textHighlightPageCount: 2
}

*/

function handleLocalMessage(event) {
  const eventName = event.name;
  const eventMessage = event.message;
  switch (eventName) {
    case 'GET_HIGHLIGHT_STATISTICS': {
      handleGetHighlightStatistics(eventMessage);
      break;
    }
    case 'OPEN_HIGHLIGHT_STREAK_POPOVER': {
      handleOpenHighlightStreakPopover(eventMessage);
      break;
    }
    case 'CLOSE_HIGHLIGHT_STREAK_POPOVER': {
      handleCloseHighlightStreakPopover();
      break;
    }
    default: {
      break;
    }
  }
}

// Create & Render Calendar

const createDay = () => `<div class="L-HighlightStreak__day"></div>`;

const createMonToSunItem = (text) => `
  <div class="L-HighlightStreak__monToSunItem">${text}</div>
`;

const createCalendar = () => {
  const monToSunItems = MON_TO_SUN.reduce((acc, text) => acc.concat(createMonToSunItem(text)), '');
  const days = createDay().repeat(NUM_OF_DAYS);

  return `<div class="L-HighlightStreak__calendar">
    <div class="L-HighlightStreak__monToSunLine">${monToSunItems}</div>
    <div class="L-HighlightStreak__days">${days}</div>
  </div>`;
};

const renderCalendar = (main) => {
  main.insertAdjacentHTML('beforeend', createCalendar());
};

// Update Calendar

const updateDayDataset = (day, videoHighlightPageCount, textHighlightPageCount) => {
  day.dataset.videoHighlightPageCount = videoHighlightPageCount;
  day.dataset.textHighlightPageCount = textHighlightPageCount;
};

const updateDay = (day, highlightStatistic) => {
  day.style.backgroundColor = getDayColorFromHighlightStat(highlightStatistic);

  const { videoHighlightPageCount, textHighlightPageCount } = highlightStatistic;
  updateDayDataset(day, videoHighlightPageCount, textHighlightPageCount);
};

const createHighlightStreakToday = () => '<div class="L-HighlightStreak__today">TODAY</div>';

const markTodayInCalendar = (days, todayIndex) => {
  const today = days[todayIndex];
  today.insertAdjacentHTML('beforeend', createHighlightStreakToday());
};

const updateCalendar = (days, highlightStatisticsForCalendar) => {
  const todayHighlightStatistic = highlightStatisticsForCalendar[0];
  const todayIndex = getTodayIndexFromDayOfWeek(todayHighlightStatistic.dayOfWeek);
  markTodayInCalendar(days, todayIndex);

  highlightStatisticsForCalendar.forEach((highlightStatistic, index) => {
    const currentIndex = todayIndex - index;
    if (currentIndex < 0) return;

    const currentDay = days[currentIndex];
    updateDay(currentDay, highlightStatistic);
  });
};

// Tooltip Create & Render

const createTooltipVideoPart = (videoHighlightPageCount) => `
  <div class="L-HighlightStreak__tooltip--video">
    <div class="L-HighlightStreak__tooltip--videoIcon"></div>
    <div class="L-HighlightStreak__tooltip--videoNumber">${videoHighlightPageCount}</div>
  </div>`;

const createTooltipTextPart = (textHighlightPageCount) => `
  <div class="L-HighlightStreak__tooltip--text">
    <div class="L-HighlightStreak__tooltip--textIcon"></div>
    <div class="L-HighlightStreak__tooltip--textNumber">${textHighlightPageCount}</div>
  </div>`;

const createTooltipForDay = (textHighlightPageCount, videoHighlightPageCount) => {
  if (!textHighlightPageCount && !videoHighlightPageCount) return '';

  AMP_HOVER_BE_HIGHLIGHT_STREAK_CALENDAR();

  return `<div class="L-HighlightStreak__tooltip">
    ${videoHighlightPageCount ? createTooltipVideoPart(videoHighlightPageCount) : ''}
    ${textHighlightPageCount ? createTooltipTextPart(textHighlightPageCount) : ''}
  </div>`;
};

const renderTooltipForDay = (day) => {
  const textHighlightPageCount = +day.dataset.textHighlightPageCount;
  const videoHighlightPageCount = +day.dataset.videoHighlightPageCount;
  day.insertAdjacentHTML(
    'beforeend',
    createTooltipForDay(textHighlightPageCount, videoHighlightPageCount),
  );
};

const eraseTooltipForDay = (day) => {
  const tooltip = day.querySelector('.L-HighlightStreak__tooltip');
  tooltip?.remove();
};

// Event Listener for Header

const onClickHeader = () => {
  const highlightStreak = document.querySelector('.L-HighlightStreak');
  const isHighlightStreakOpened = highlightStreak.classList.contains('L-Opened');

  if (isHighlightStreakOpened) {
    apiCloseHighlightStreakPopover();
    AMP_CLOSE_BE_HIGHLIGHT_STREAK_CALENDAR();
  } else {
    apiOpenHighlightStreakPopover();
    AMP_OPEN_BE_HIGHLIGHT_STREAK_CALENDAR();
  }
};

const addClickEventToHeader = (header) => {
  header.addEventListener('click', onClickHeader);
};

// Event Listener for Day

const onMouseEnterDay = (e) => {
  renderTooltipForDay(e.currentTarget);
};

const onMouseLeaveDay = (e) => {
  eraseTooltipForDay(e.currentTarget);
};

const addHoverEventToDays = (days) => {
  days.forEach((day) => {
    day.addEventListener('mouseenter', onMouseEnterDay);
    day.addEventListener('mouseleave', onMouseLeaveDay);
  });
};

// Amplitude

const AMP_OPEN_BE_HIGHLIGHT_STREAK_CALENDAR = () => {
  messageToNative('AMPLITUDE_EVENT', {
    event_name: 'open_be_highlight_streak_calendar',
    properties: {
      url: getUrl().href,
      url_domain: getUrl().hostname,
    },
  });
};

const AMP_CLOSE_BE_HIGHLIGHT_STREAK_CALENDAR = () => {
  messageToNative('AMPLITUDE_EVENT', {
    event_name: 'close_be_highlight_streak_calendar',
    properties: {
      url: getUrl().href,
      url_domain: getUrl().hostname,
    },
  });
};

const AMP_HOVER_BE_HIGHLIGHT_STREAK_CALENDAR = () => {
  messageToNative('AMPLITUDE_EVENT', {
    event_name: 'hover_be_highlight_streak_calendar',
    properties: {
      url: getUrl().href,
      url_domain: getUrl().hostname,
    },
  });
};

const AMP_VIEW_BE_HIGHLIGHT_STREAK_CALENDAR = () => {
  messageToNative('AMPLITUDE_EVENT', {
    event_name: 'view_be_highlight_streak_calendar',
    properties: {
      url: getUrl().href,
      url_domain: getUrl().hostname,
    },
  });
};

// Before Load

updateTitle(title);
addClickEventToHeader(header);
renderCalendar(main);
apiGetHighlightStatistics();
