var $el = $('#Background');

var p_x,
  p_y,
  window_width = window.innerWidth,
  window_height = window.innerHeight;

var m = {
  moving_left: false,
  moving_up: false,
  last_x: 0,
  last_y: 0,
  x: 0,
  y: 0,
};

var colors = {
  orange: {r: 238, g: 119, b: 0},
  blue: {r: 40, g: 203, b: 215},
};

$el.on('mousemove', function(e) {
  m.x = e.pageX;
  m.y = e.pageY;

  m.moving_left = m.x < m.last_x ? true : false;
  m.moving_up = m.y < m.last_y ? true : false;

  m.last_x = m.x;
  m.last_y = m.y;

  var percentage = m.y / window_width;
  var col =
    'rgb(' +
    getRed(percentage) +
    ',' +
    getGreen(percentage) +
    ',' +
    getBlue(percentage) +
    ')';

  $el.css('background-color', col);
});

function getRed(percentage) {
  var max = 238,
    min = 40;
  var range = max - min;
  return min + Math.floor(range * percentage);
}

function getGreen(percentage) {
  var max = 119,
    min = 203;
  var range = max - min;
  return min + Math.floor(range * percentage);
}

function getBlue(percentage) {
  var max = 0,
    min = 215;
  var range = max - min;
  return min + Math.floor(range * percentage);
}
