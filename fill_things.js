document.addEventListener('DOMContentLoaded', function() {
  var canvas = document.getElementById('myCanvas');
  canvas.width = window.innerWidth * 0.5;
  canvas.height = canvas.width;
  var ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  (function() {
    const dropzone = document.getElementById('dropzone');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight dropzone when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, highlight, false);
    });

    // Remove highlight when leaving dropzone
    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropzone.addEventListener('drop', handleDrop, false);

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function highlight(e) {
      dropzone.classList.add('highlight');
    }

    function unhighlight(e) {
      dropzone.classList.remove('highlight');
    }

    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;

      // Read contents of dropped file(s)
      for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
	if (data.length < 64 * 64 * 4) {
	    console.log(data.length)
	    return;
	}

        // We draw multiple time since
	// I didn't have the time to investgate
	// stupid canvas api's interpolation

        for(var draw_num = 0; draw_num < 3; ++draw_num) {
	let it = 0;
	for(var i = 0; i < 64; ++i) {
	  for(var j = 0; j < 64; ++j) {
            let x = canvas.width * j / 64;
	    let y = canvas.height * i / 64;
	    let w = canvas.width / 64;
	    let h = canvas.height / 64;


	    let red = data[it++];
	    let green = data[it++];
	    let blue = data[it++];
	    let alpha = data[it++];
	    alpha /= 255;



            let color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
	    console.log(color);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);

	  }
	}

	}

      };

      reader.readAsArrayBuffer(file);
      }
    }
  }());
});
