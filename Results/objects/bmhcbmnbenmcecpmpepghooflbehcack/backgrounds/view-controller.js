$(document).ready(function () {
  logger('view-controller.js loaded');
});

function showHighlightStreakPopover(page) {
  executeCSSFile(page, '/views/highlightStreak/iframe-highlightStreak-v1.css', function (result) {
    messageTo(page, 'INJECT_POPOVER', {
      class: `liner-popover liner-popover-highlightStreak ${
        checkIsRecentStreakOpened() ? 'L-Opened' : ''
      }`,
      src: browser.extension.getURL('/views/highlightStreak/highlightStreak-v1.html'),
      style: '',
    });
  });
}

function showPopover(page, type) {
  // Luke - 이미 삽입되어 있는 팝오버는 제거함
  messageTo(page, 'REMOVE_ALL_POPOVER', {});

  if (page.url) {
    const pageUrl = new URL(page.url);
    const isLinerPage = pageUrl.host.includes('getliner.com');
    if (isLinerPage) {
      return;
    }
  }

  function showNewTabPopover() {
    executeCSSFile(page, '/views/newTab/iframe-newTab-v1.css', function (result) {
      messageTo(page, 'INJECT_POPOVER', {
        class: 'liner-popover liner-popover-newTab',
        src: browser.extension.getURL('/views/newTab/newTab-v1.html'),
        style: '',
      });
    });
  }

  function showAppInstallPopover() {
    executeCSSFile(page, '/views/appInstall/iframe-appInstall-v1.css', function (result) {
      messageTo(page, 'INJECT_POPOVER', {
        class: 'liner-popover liner-popover-appInstall',
        src: browser.extension.getURL('/views/appInstall/appInstall-v1.html'),
        style: '',
      });
    });
  }

  function showNewTabOrHighlightStreakPopover() {
    const isTriggeredByHighlight = type === 'isTriggeredByHighlight=true';
    if (checkIsHighlightStreakCohort()) {
      if (isTriggeredByHighlight) showHighlightStreakPopover(page);
      return;
    }
    showNewTabPopover();
  }

  // Luke - 사용자가 하이라이트를 했음. 일반 팝오버를 보여줄 것
  function showMainPopover() {
    if (!isLoggedIn()) return;

    executeCSSFile(page, '/views/main/iframe-main-v5.css', function (result) {
      messageTo(page, 'INJECT_POPOVER', {
        class: 'liner-popover liner-popover-main',
        src: browser.extension.getURL(`/views/main/main-v5.html?${type}`),
        style: '',
      });

      executeCSSFile(page, '/views/folder/iframe-folder-dropdown.css', function () {
        messageTo(page, 'INJECT_POPOVER', {
          class: 'liner-popover liner-popover-folder-dropdown L-folder-dropdown-hidden',
          src: browser.extension.getURL('/views/folder/folder-dropdown.html'),
          style: '',
        });
      });

      setTimeout(function () {
        messageTo(page, 'ANIMATE_POPOVER_SHOW', {
          type: 'main',
        });
        fetchTagsFromServer(function () {});
      }, 100);
    });
  }

  function prepareIAM() {
    executeCSSFile(page, '/views/iam/iframe-iam.css', function (result) {
      var iamViewHeight = (280 * iamCampaign.banner_height) / iamCampaign.banner_width;
      messageTo(page, 'INJECT_POPOVER', {
        class: 'liner-iam',
        src: browser.extension.getURL('/views/iam/iam.html'),
        style: `height: ${iamViewHeight}px !important`,
      });
      setTimeout(function () {
        showIAM(page);
      }, 700);
    });
  }

  if (tags == null) {
    fetchTagsFromServer(function () {
      showMainPopover();
      showNewTabOrHighlightStreakPopover();
    });
  } else {
    showMainPopover();
    showNewTabOrHighlightStreakPopover();
  }

  getEligibleCampaigns(user.id, function (json) {
    iamCampaign = {};

    try {
      const eligibleCampaigns = json.eligible_campaigns;
      for (var i = 0; i < eligibleCampaigns.length; i++) {
        const campaign = eligibleCampaigns[i];
        if (campaign.launch_status == 1 || isEligibleForCampaign(campaign) === true) {
          iamCampaign = campaign;
          prepareIAM();
          break;
        }
      }
    } catch (e) {}
  });
}

function showIAM(page) {
  messageTo(page, 'SHOW_IAM', {});
}

function hideIAM(page, removeIAM) {
  messageTo(page, 'HIDE_IAM', {});
  if (removeIAM) {
    setTimeout(function () {
      messageTo(page, 'REMOVE_IAM', {});
    }, 200);
  }
}

function hidePopover(page) {
  messageTo(page, 'ANIMATE_POPOVER_REMOVE', {});
  hideIAM(page, true);
}
