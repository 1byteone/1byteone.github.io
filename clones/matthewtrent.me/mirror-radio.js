(function () {
  'use strict';

  // The cloned site's runtime already plays its locally mirrored radio tracks.
  // Keep this compatibility file free of Spotify iframes and click interception.
  function removeLegacyPlayer() {
    var legacyPlayer = document.getElementById('mirror-radio-player');
    if (legacyPlayer) legacyPlayer.remove();
    document.querySelectorAll('link[rel="stylesheet"][href*="mirror-radio.css"]').forEach(function (link) {
      link.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeLegacyPlayer, { once: true });
  } else {
    removeLegacyPlayer();
  }
})();
