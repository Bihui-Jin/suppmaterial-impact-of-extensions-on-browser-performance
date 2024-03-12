var iamCampaign = {};

function handleLocalMessage(event) {
  if (event.name == 'IAM_INIT') {
    iamCampaign = event.message.iam_campaign;
    setUI();
    addEvents();

    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'view_engagement_marketing_campaign',
      properties: {
        category: iamCampaign.event_category,
        campaign_name: iamCampaign.event_campaign_name,
        channel: iamCampaign.event_channel,
        label_content: iamCampaign.event_label_content,
      },
    });

    messageToNative('GA_EVENT', {
      category: 'iam',
      action: 'iam_shown_' + iamCampaign.id,
      label: iamCampaign.id,
    });
  }
}

$(document).ready(function () {
  messageToNative('GA_PAGEVIEW', {
    path: '/liner-iam',
  });

  messageToNative('IAM_INIT', {});
});

function setUI() {
  $('.iamLink').attr('href', iamCampaign.landing_url);

  var bannerKey = 'banner_image_en';
  try {
    bannerKey = 'banner_image_' + getLanguage();
  } catch (e) {}
  if (!iamCampaign[bannerKey]) {
    bannerKey = 'banner_image_en';
  }
  $('.iamBannerImage').attr('src', iamCampaign[bannerKey]);
}

function addEvents() {
  $('.iamLink').click(function (e) {
    try {
      e.stopPropagation();
    } catch (e) {}
    messageToNative('GA_EVENT', {
      category: 'iam',
      action: 'iam_click_' + iamCampaign.id,
      label: iamCampaign.id,
    });
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_upgrade_flow_entry',
      properties: {
        wording: 'Redeem Offer',
        entry: 'be_bec',
      },
    });
  });

  $('.iamCloseBtn').click(function (e) {
    try {
      e.stopPropagation();
    } catch (e) {}
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'close_engagement_marketing_campaign',
      properties: {
        category: iamCampaign.event_category,
        campaign_name: iamCampaign.event_campaign_name,
        channel: iamCampaign.event_channel,
        label_content: iamCampaign.event_label_content,
      },
    });
    messageToNative('GA_EVENT', {
      category: 'iam',
      action: 'iam_close_' + iamCampaign.id,
      label: iamCampaign.id,
    });
    messageToNative('CLOSE_IAM', {
      remove_iam: true,
      never_show_again: iamCampaign.is_re_eligible == 0,
    });
  });
}
