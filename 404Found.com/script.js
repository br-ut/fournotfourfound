
;(function(window,document) {
  // https://developer.mozilla.org/en-US/docs/Web/Events/wheel

  var prefix = "", _addEventListener, onwheel, support;

  // detect event model
  if ( window.addEventListener ) {
    _addEventListener = "addEventListener";
  } else {
    _addEventListener = "attachEvent";
    prefix = "on";
  }

  // detect available wheel event
  support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
  document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
  "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

  window.addWheelListener = function( elem, callback, useCapture ) {
    _addWheelListener( elem, support, callback, useCapture );

    // handle MozMousePixelScroll in older Firefox
    if( support == "DOMMouseScroll" ) {
      _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
    }
  };

  function _addWheelListener( elem, eventName, callback, useCapture ) {
    elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
      !originalEvent && ( originalEvent = window.event );

      // create a normalized event object
      var event = {
        // keep a ref to the original event object
        originalEvent: originalEvent,
        target: originalEvent.target || originalEvent.srcElement,
        type: "wheel",
        deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
        deltaX: 0,
        deltaZ: 0,
        preventDefault: function() {
          originalEvent.preventDefault ?
            originalEvent.preventDefault() :
          originalEvent.returnValue = false;
        }
      };

      // calculate deltaY (and deltaX) according to the event
      if ( support == "mousewheel" ) {
        event.deltaY = - 1/40 * originalEvent.wheelDelta;
        // Webkit also support wheelDeltaX
        originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
      } else {
        event.deltaY = originalEvent.detail;
      }

      // it's time to fire the callback
      return callback( event );

    }, useCapture || false );
  }
})(window,document);

$(function() {
  'use strict';

  var container,
      camera, scene, renderer, particles, geometry, material,
      i, h, color = [0, 1, 0.5], size = 2,
      mouseX = 0,
      mouseY = 0,
      windowHalfX = window.innerWidth / 2,
      windowHalfY = window.innerHeight / 2,
      stats = new Stats();

  stats.setMode(0); // Start off with FPS mode

  // Place the statistics at the bottom right.
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right = '5px';
  stats.domElement.style.bottom = '5px';

  // Append the statistics element to the body.
  $('body').append($(stats.domElement));

  function v3(vec, cx, cy, cz, ax, ay, rx, ry, rz, v) {
    v = v || 0;

    // calculate position
    vec.x = (cx + (rx * Math.cos(ay) * Math.cos(ax)));
    vec.y = (cy + (ry * Math.sin(ax)));
    vec.z = (cz + (rz * Math.sin(ay) * Math.cos(ax)));

    // variation
    switch (v) {
        // variation 0 needs no additional calculation
      case 1: {
        vec.y *= Math.tan(ay);
      } break;
      case 2: {
        vec.x *= Math.sin(ay);
      } break;
      case 3: {
        vec.z *= Math.tan(ax);
      } break;
      case 4: {
        vec.z *= Math.tan(ay);
      } break;
      case 5: {
        vec.x *= Math.PI;
        vec.y *= Math.PI;
        vec.z *= Math.PI;
      } break;
      case 6: {
        vec.x *= (Math.PI / 2);
        vec.y *= (Math.PI / 2);
        vec.z *= (Math.PI / 2);
      } break;
      case 7: {
        vec.z = cz + rz * Math.tan(ax) * Math.sin(ay);
      } break;
    };
  };

  // random with minimum and maximum
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // random with maximum
  function randm(max) {
    return Math.floor(Math.random() * max);
  };

  // degree to radian
  var rad = function rad(deg) {
    return (deg * (Math.PI / 180));
  };

  // a few generators, these actually create the shapes.
  var generators = [
    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, x, y, x, x, y, v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, x, y, x * Math.tan(Math.cos(y)), randm(100), x - 1, v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, randm(360), randm(360), x, randm(400), x, v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, x * 0.3, y * 0.4, x * 0.2, randm(100), x, v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, x, 0, x * Math.sqrt(y), y * Math.sin(y), x * Math.cos(x), randm(700), x, v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, randm(180), randm(180), x + randm(20), x + randm(20), y + randm(20), v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, (x + 1) / 0.6, (y + 2) / 0.4, x, y, x, v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, x, y, x, randm(100), x, v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, randm(60), y, x + randm(100), randm(100), x + randm(100), v);
    },

    function(vec, x, y, v) {
      return v3(vec, (rand(1, 15) / 0.3), (rand(1, 15) / 0.3), (rand(1, 15) / 0.3), randm(90), randm(90), x + randm(100), x + randm(100), x + randm(100), v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, x * 0.3, y * 0.2, x, x, y, v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, x, y, x, x, x, v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, x, y, x * Math.tan(Math.cos(y)), y * Math.tan(Math.sin(x)), x - 1, v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, x, y, x * Math.tan(Math.cos(y)), y * Math.tan(Math.sin(x)), x * Math.tan(Math.cos(y)), v);
    },

    function(vec, x, y, v) {
      return v3(vec, 0, 0, 0, rad(x), rad(y), x * Math.tan(Math.sin(y)), y * Math.tan(Math.cos(x)), x * Math.tan(Math.sin(y)), v);
    }
  ];

  /**
		generate a geometry with one million particles, calculated with one of the generators, the
		calc function and a specified variety.
	*/
  var generate = function generate(mode, variety) {
    if (typeof(generators[mode]) !== "function") {
      return null;
    }

    var generator = generators[mode];
    var geometry = new THREE.Geometry();
    for (var x = 0; x < 1000; x++) {
      for (var y = 0; y < 1000; y++) {
        var vector = new THREE.Vector3();
        generator(vector, x, y, variety);
        geometry.vertices.push(vector);
      }
    }

    return geometry;
  };

  function initScene() {
    scene = new THREE.Scene();

    // random generator and variation
    var generator = (rand(1, generators.length) - 1);
    var variation = (rand(1, 8) - 1);
    geometry = generate(generator, variation);

    // create a material for the particles, with transparency enabled.
    material = new THREE.PointCloudMaterial({
      size: size,
      opacity: 0.4,
      alphaTest: 0.4,
      transparent: true
    });

    // make the point cloud happen
    particles = new THREE.PointCloud(geometry, material);
    particles.rotation.x = 1;
    particles.rotation.y = 4;
    particles.rotation.z = rad(90);

    scene.add(particles);
  };

  function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.z = 2450;

    initScene();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    $(document).on('mousemove', function(event) {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    });

    $(document).on('touchstart', function(event) {
      if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
      }
    });

    $(document).on('touchmove', function(event) {
      if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
      }
    });

    window.addWheelListener(window, function(event) {
      var delta = (event.deltaY < 0 ? -1 : 1);

      camera.position.z += (delta * 100);
      if(camera.position.z < 500) {
        camera.position.z = 500;
      } else if(camera.position.z > 4000) {
        camera.position.z = 4000;
      }

      camera.lookAt(scene.position);

      event.preventDefault();
    });

    $(window).resize(function() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    $('#rerender').click(function() {
      history.go(0); // location.reload is filtered by codepen? :(

      return false;
    });
  }

  function render() {
    var time = Date.now() * 0.00007;
    camera.position.x += (mouseX - camera.position.x) * 0.07;
    camera.position.y += (-mouseY - camera.position.y) * 0.07;
    camera.lookAt(scene.position);

    for (i = 0; i < scene.children.length; i++) {
      var object = scene.children[i];
      if (object instanceof THREE.PointCloud) {
        object.rotation.y = time;
        object.rotation.z = time * 0.7;
      }
    }

    var h = ((360 * (color[0] + time) % 360) / 360);
    //h = (mouseX / window.innerWidth);
    material.color.setHSL(h, color[1], color[2]);

    renderer.render(scene, camera);
  }

  function draw() {
    requestAnimationFrame(draw);
    stats.begin();
    render();
    stats.end();
  }

  init();
  draw();
});
