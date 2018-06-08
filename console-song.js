// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = '';

// Set token
let _token = hash.access_token || localStorage.getItem('token');
if (hash.access_token) {
  localStorage.setItem('token', hash.access_token);
}

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'c8bf4325fa1d482cb618daee323dacab';
const redirectUri = `${window.location.protocol}//${window.location.host}${
  window.location.pathname
}`;
const scopes = [
  'streaming',
  'user-read-birthdate',
  'user-read-email',
  'user-read-private',
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    '%20',
  )}&response_type=token&show_dialog=true`;
}

// Set up the Web Playback SDK
window.onSpotifyPlayerAPIReady = () => {
  const player = new Spotify.Player({
    name: 'console.song();',
    getOAuthToken: cb => {
      cb(_token);
    },
  });

  // Error handling
  player.on('initialization_error', e => console.error(e));
  player.on('authentication_error', e => {
    console.error(e);
    localStorage.removeItem('token');
  });
  player.on('account_error', e => console.error(e));
  player.on('playback_error', e => console.error(e));

  // Ready
  player.on('ready', readyData => {
    let currentTimeout;
    const deviceId = readyData.device_id;

    console.song = function(song, timer) {
      if (!timer) {
        timer = 10000;
      }

      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      search(song).then(data => {
        const track = data.tracks.items[0].uri;
        play(track, deviceId);

        currentTimeout = setTimeout(() => {
          pause(deviceId);
        }, timer);
      });
    };

    console.pause = function() {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      pause(deviceId);
    };
  });

  // Connect to the player!
  player.connect();
};

// Play a specified track on the Web Playback SDK's device ID
function play(track, deviceId) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/play?device_id=' + deviceId,
      type: 'PUT',
      data: JSON.stringify({uris: [track]}),
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
      },
      success: function(data) {
        resolve(data);
      },
    });
  });
}

function pause(deviceId) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/pause?device_id=' + deviceId,
      type: 'PUT',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
      },
      success: function(data) {
        resolve(data);
      },
    });
  });
}

// Search for a song
function search(query) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'https://api.spotify.com/v1/search?type=track&limit=1&q=' + query,
      type: 'GET',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
      },
      success: function(data) {
        resolve(data);
      },
    });
  });
}
