function SaveToDisk(fileURL, fileName) {
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        save.download = fileName || fileURL;
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,
            false, false, false, false, 0, null);
        save.dispatchEvent(evt);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

    // for IE
    else if ( !! window.ActiveXObject && document.execCommand)     {
        var _window = window.open(fileURL, "_blank");
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}


var test = [ // Portraits
  {image: 'http://farm6.staticflickr.com/5331/9022853172_424fb03e3a_b.jpg', thumb: 'http://farm6.staticflickr.com/5331/9022853172_424fb03e3a_s.jpg'},
  {image: 'http://farm8.staticflickr.com/7390/9020626217_f693407f1a_b.jpg', thumb: 'http://farm8.staticflickr.com/7390/9020626217_f693407f1a_s.jpg'},
  {image: 'http://farm9.staticflickr.com/8406/9022857702_ff0d80c474_b.jpg', thumb: 'http://farm9.staticflickr.com/8406/9022857702_ff0d80c474_s.jpg'},
  {image: 'http://farm3.staticflickr.com/2870/9020629059_c987e5b821_b.jpg', thumb: 'http://farm3.staticflickr.com/2870/9020629059_c987e5b821_s.jpg'}, 
  {image: 'http://farm4.staticflickr.com/3766/9020633687_7ca4e22ea5_b.jpg', thumb: 'http://farm4.staticflickr.com/3766/9020633687_7ca4e22ea5_s.jpg'},
  {image: 'http://farm6.staticflickr.com/5465/9020624741_053cbf76dd_b.jpg', thumb: 'http://farm6.staticflickr.com/5465/9020624741_053cbf76dd_s.jpg'},
  {image: 'http://farm9.staticflickr.com/8119/9020623089_49313a7d71_b.jpg', thumb: 'http://farm9.staticflickr.com/8119/9020623089_49313a7d71_s.jpg'},
  {image: 'http://farm6.staticflickr.com/5322/9022847102_fb9d364258_b.jpg', thumb: 'http://farm6.staticflickr.com/5322/9022847102_fb9d364258_s.jpg'},
      ]

    for (var i = 0;i < backgrounds.length;i++) 
     {
SaveToDisk(backgrounds[i].fullUrl,backgrounds[i].fullUrl.substring(backgrounds[i].fullUrl.lastIndexOf('/')+1)+'.jpg');
    }