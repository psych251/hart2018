jsPsych.plugins["triangle"] = (function() {

  var plugin = {};


  plugin.info = {
    name: "triangle",
    parameters: {
        trial_type: {
          type: jsPsych.plugins.parameterType.STRING,
          default: undefined,
        },
        image: {
          type: jsPsych.plugins.parameterType.STRING,
          default: undefined,
        },
    }
  }

  plugin.trial = function(display_element, trial) {

      var verbose = false; //for testing purposes, logs things to the console

      // canvas
      var html = '<div id="trial" class="trialDiv">'

      // trial instruction
      if (trial.trial_type == 'prac') {
          html += '<p> Move dot to the top corner location (marked in light blue). </p>';
      } else if (trial.trial_type == 'test') {
          html += '<p> Move dot to the top corner location. </p>';
      }

      // image and moving dot
      html += '<div id="imageDiv" class="imgDiv">';
      html += '<div id="dot" class="dot"></div>';
      html += '<img id="image" src=\"' + trial.image + '\" alt="Triangle">';
      html += '</div>';

      // continue button
      html += '<div id="continueButton" class="continueButton">Continue</div>';

      display_element.innerHTML = html;

      // trial data vars
      var click_x, click_y, rt, startTime;

      function moveDot(e){
          var left, top;
          left = e.pageX - 5;
          top = e.pageY - 5;

          // if mouse position is outside of the parent trial div, freeze dot at boundary
          if (left < $('#trial').offset().left){
              left = $('#trial').offset().left;
          }
          else if (left > $('#trial').offset().left + $('#trial').width()){
              left = $('#trial').offset().left + $('#trial').width();
          }
          if (top < $('#trial').offset().top + 44){ //skip the instructions
              top = $('#trial').offset().top + 44;
          }
          else if (top > $('#trial').offset().top + $('#trial').height()){
              top = $('#trial').offset().top + $('#trial').height();
          }
          $('#dot').css({
              left: left,
              top: top
          });
      }

      function dropDot() {
          /* record data:
             - account for the radius (5px) of the dot and record the x-y coordinates of the center of the dot,
               relative to the image boundaries (x-axis starts from left, y-axis starts from top)
             - the starting position of the dot is (5,5) relative to image
             - image dimension is 285px by 435px;
          */
          var curTime = new Date();
          rt = curTime - startTime;
          click_x = ($('#dot').position().left + $('#dot').width()/2) - $('#image').position().left;
          click_y = ($('#dot').position().top + $('#dot').height()/2) - $('#image').position().top;
          if (verbose) {
              console.log('click_x:', click_x);
              console.log('click_y:', click_y);
              console.log('rt:', rt);
          }
          $(document).unbind(); //disable dot moving with mouse
          $("#continueButton").show();
      }

      function trialIsOver() {

          display_element.innerHTML = '';

          // data saving
          var trial_data = {
              trial_type: trial.trial_type,
              image: trial.image,
              click_x: click_x,
              click_y: click_y,
              rt: rt,
          };

          // end trial
          jsPsych.finishTrial(trial_data);
      }

      // experiment flow
      startTime = new Date();
      $(document).bind('mousemove', moveDot);
      $('#dot').click(dropDot);
      $('#continueButton').click(trialIsOver);
  };

  return plugin;
})();
