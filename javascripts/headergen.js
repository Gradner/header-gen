//initalize canvas and customerdata object

var customerData = {};
var canvas = document.getElementById('header');
var header = canvas.getContext("2d");
customerData.phoneOffsetX = 0;
var rspTextOffsetY = 0;
var backgroundType = "list";

//initialize images and assign those that are pre-set rather than customer selected

backgroundImage = new Image();
customerData.headShot = new Image();
customerData.companyLogo = new Image();
customerData.customBgImg = new Image();
customerData.fbLogo = new Image();
customerData.fbLogo.src = './images/social_fb_white.png';
customerData.twLogo = new Image();
customerData.twLogo.src = './images/social_tw_white.png';
customerData.liLogo = new Image();
customerData.liLogo.src = './images/social_in_white.png';
customerData.ytLogo = new Image();
customerData.ytLogo.src = './images/social_yt_white.png';
customerData.igmLogo = new Image();
customerData.igmLogo.src = './images/social_igm_white.png';
customerData.gglLogo = new Image();
customerData.gglLogo.src = './images/social_ggl_white.png';
customerData.pinLogo = new Image();
customerData.pinLogo.src = './images/social_pin_white.png';

// Prevent the user from selecting more than 4 social media options (the current maximum)

var socialChecks = $("input:checkbox");
socialChecks.click(function(){
  if(socialChecks.filter(":checked").length > 4){
    $(this).removeProp("checked");
    $(this).removeAttr("checked");
    console.log("that's too many!");
  }
})

// Toggle to switch between drop-down background selection and custom background upload

var bgType = $("input:radio");
bgType.click(function(){
  $(bgType).each(function(){
    if($(this).prop("checked") == true){
      backgroundType = $(this).val();
    }
    if(backgroundType == "custom"){
      $("#backgroundUpload").css("display", "table-row");
      $("#backgroundList").css("display", "none");
    }
    if(backgroundType == "list"){
      $("#backgroundUpload").css("display", "none");
      $("#backgroundList").css("display", "table-row");
    }
  })
  
})

// Main Header Generator function that is called when the form is submitted.
// Serializes the customer input and populates the customer data object, handles x axis
// offsets added for social media buttons and then fires the script that populates the
// canvas element.

function generateHeader(event){
  event.preventDefault();
  customerData.phoneOffsetX = 0;
  rspTextOffsetY = 0;
  header.clearRect(0, 0, canvas.width, canvas.height);
  $("#headerGen").find("input:checkbox").each(function(){
    if($(this).prop("checked") == true){
      $(this).val("1");
      customerData.phoneOffsetX += 24;
      console.log(customerData.phoneOffsetX);
    } else {
      $(this).val("0");
    };
  });
  $("#headerGen").find(":input").each(function(){
    customerData[this.name] = $(this).val();
  });
  customerData.backgroundType = backgroundType;
  if(backgroundType == "list"){
    backgroundImage.onload = function(){
     populateCanvas(); 
    }
    backgroundImage.src = customerData.stdBgImg.fullUrl;
  } else {
    backgroundImage.onload = function(){
     populateCanvas(); 
    }
    backgroundImage.src = customerData.customBgImg.src;
  }
  console.log(customerData);
};

// Event handler that watches for the customer to select a photo from their computer.
//
// Since we don't want to upload the images to a server, just use them to draw on the
// canvas element, we need to generate a URL that our canvas can use to find the image.


function loadImg(event, previewElement, customerDataSource){
  var element = previewElement;
  element.src = URL.createObjectURL(event.target.files[0]);
  var target = customerDataSource;
  target.src = element.src;
}

// The following 2 functions activate the "DDSlick" dropdown plugin on the page.
// This is a great jquery plugin for dropdown menus with previw graphics!
//
// More info available at http://designwithpc.com/Plugins/ddSlick

$("#bgDrop").ddslick({
  data:backgrounds,
  width:300,
  height:300,
  selectText:"Select a Background Image",
  imagePosition:"left",
  onSelected: function(selectedData){
    customerData.stdBgImg = selectedData.selectedData;
    $("#stdHeaderPreload").attr("src", selectedData.fullUrl);
  }
})

$("#clrDrop").ddslick({
  data:colorSchemes,
  width:300,
  height:300,
  selectText:"Select a Color Scheme",
  imagePosition:"left",
  onSelected: function(selectedData){
    customerData.clrScheme = selectedData.selectedData;
  }
})

// The following function is used to scale images uploaded to the generator
//
// It takes a desired width and height and calculates the best ratio to use
// in scaling the image.
//
// The best ratio will always be the one that requires the least amount of
// resizing, but covers at least one of the dimensions fully.
//
// There is also a boolean that can be set (useReqWidth) which is false by default
// but can be set to true to allow the image to always cover the full width.

function getRatio(width, height, useReqWidth){
  var ratio = 1;
  var ratio1 = 1;
  var ratio2 = 1;
  var w = width;
  var h = height;
  var required = useReqWidth || false;
  var self = this;
  if(required == false){
    if(this.width > w)
      ratio1 = w / self.width;
    if(this.height > h)
      ratio2 = h / self.height;
    if(ratio1 >= ratio2){
      ratio = ratio2;
    } else {
      ratio = ratio1;
    }
  } else {
    if(this.width != w)
      ratio1 = w / self.width;
    if((this.height * ratio1) < h)
      ratio2 = h / self.height;
    if(ratio1 >= ratio2 && (self.width * ratio2) >= w){
      ratio = ratio2;
    } else {
      ratio = ratio1;
    }
  }
  return ratio;
}

// This is a function pulled from HTML5 Canvas Tutorials (thanksguys!) which
// automatically wraps text drawn to the canvas. This prevents text from overrunning
// the desired width set out for it.
//
// Added an offset to automatically tighten up the text if a text-box is not filled.

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  if(text != ''){
    var words = text.toString().split(' ');
    var line = '';
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
        rspTextOffsetY += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  } else {
    rspTextOffsetY -= (lineHeight + 5);
  }
}

// This is the meat and potatoes of the project. The following function populates
// the canvas with our customer data. It could probably be re-factored, however it
// is extremely important that the data be written to the canvas in a specific order
// since foreground elements must be drawn after background elements.
//
// As a result, I've opted to keep the function as a long in-line set of instructions.
// This way, the order of individual instructions can be shifted around with relative
// ease.
//
// If the project has additional variables added, it may be worthwhile to factor it out
// but for now it just seems needless. We know exactly what data we're expecting, so
// there really is no need to account for other possibilities.

function populateCanvas(){
  drawBaseCanvas();
  header.font="26px LatoWebBold";
  header.fillStyle = customerData.clrScheme.color2;
  wrapText(header, customerData.firstName + " " + customerData.lastName, 32, 266, 320, 26);
  header.font="14px LatoWeb";
  header.fillStyle = customerData.clrScheme.color2;
  wrapText(header, customerData.jobTitle, 32, 285 + rspTextOffsetY, 320, 14);
  header.font="italic 20px LatoWebSemibold";
  header.fillStyle = customerData.clrScheme.color3;
  wrapText(header, customerData.personalSlogan, 32, 310 + rspTextOffsetY, 320, 20);
  header.font="18px LatoWebSemibold";
  header.fillStyle = customerData.clrScheme.color2;
  wrapText(header, customerData.webAddr, 32, 333 + rspTextOffsetY, 320, 18);
  header.font="18px LatoWebSemibold";
  header.fillStyle = "#ffffff";
  header.fillText(customerData.phoneNumber, 550 - (customerData.phoneOffsetX + ((header.measureText(customerData.phoneNumber).width - 12))), 205);
  drawSocialButtons();
  var logoRatio = getRatio.call(customerData.companyLogo, 200, 150);
  header.drawImage(customerData.companyLogo, 570 - (customerData.companyLogo.width * logoRatio), 215 + ((170 - (customerData.companyLogo.height * logoRatio)) / 2), (customerData.companyLogo.width * logoRatio), (customerData.companyLogo.height * logoRatio));
  header.shadowColor = "rgba(64,64,64,0.8)"
  header.shadowBlur = 2;
  header.shadowOffsetX = 2;
  header.shadowOffsetY = 2;
  var headshotRatio = getRatio.call(customerData.headShot, 150, 200);
  header.drawImage(customerData.headShot, 32, 235 - (customerData.headShot.height * headshotRatio), (customerData.headShot.width * headshotRatio), (customerData.headShot.height * headshotRatio));
  header.font="italic 36px LatoWebBold";
  header.fillStyle = "#ffffff"
  wrapText(header, customerData.bannerQuote, 230, 75, 320, 36);
  header.shadowColor = "#fff"
  header.shadowBlur = 0;
  header.shadowOffsetX = 0;
  header.shadowOffsetY = 0;
  var canvasImgUrl = canvas.toDataURL("image/jpeg", 1.0);
  document.getElementById("stdHeaderPreload").src = canvasImgUrl;
  $(".headerInstructions").css("display", "block");
};

// This function takes the final selected background image and draws it to the canvas
//
// It also draws some rectangles to add the coloured bars and whitespace on the canvas

function drawBaseCanvas(){
  var bgRatio = getRatio.call(backgroundImage, 768, 275, true);
  bgWidth = backgroundImage.width * bgRatio;
  bgHeight = backgroundImage.height * bgRatio;
  bgOffsetX = (bgWidth - 580) / 2;
  bgOffsetY = (bgHeight - 178) / 2;
  header.drawImage(backgroundImage,-bgOffsetX,-bgOffsetY,bgWidth,bgHeight);
  header.fillStyle = customerData.clrScheme.color1;
  header.fillRect(0,178,580,200);
  header.fillStyle = customerData.clrScheme.color2;
  header.fillRect(0,182,580,200);
  header.fillStyle = "#ffffff"
  header.fillRect(0,213,580,400);
}

// This is a messy function that could use some factoring.
//
// Takes a look at the array of social media options that were checked
// and determines one-by-one which should be displayed.
//
// It's messy and brings shame to my family, but it works.

function drawSocialButtons(){
  header.fillStyle = customerData.clrScheme.color3;
  if(customerData.facebookCheck != "0"){
    header.beginPath();
    header.arc(580 - customerData.phoneOffsetX, 198, 9, 0, 2 * Math.PI);
    header.fill();
    header.drawImage(customerData.fbLogo, 576 - customerData.phoneOffsetX, 192, 8, 12);
    customerData.phoneOffsetX -= 24
    console.log(customerData.phoneOffsetX);
  }
  if(customerData.twitterCheck != "0"){
    header.beginPath();
    header.arc(580 - customerData.phoneOffsetX, 198, 9, 0, 2 * Math.PI);
    header.fill();
    header.drawImage(customerData.twLogo, 574 - customerData.phoneOffsetX, 192, 12, 12);
    customerData.phoneOffsetX -= 24
    console.log(customerData.phoneOffsetX);
  }
  if(customerData.linkCheck != "0"){
    header.beginPath();
    header.arc(580 - customerData.phoneOffsetX, 198, 9, 0, 2 * Math.PI);
    header.fill();
    header.drawImage(customerData.liLogo, 574 - customerData.phoneOffsetX, 192, 12, 12);
    customerData.phoneOffsetX -= 24
    console.log(customerData.phoneOffsetX);
  }
  if(customerData.youtubeCheck != "0"){
    header.beginPath();
    header.arc(580 - customerData.phoneOffsetX, 198, 9, 0, 2 * Math.PI);
    header.fill();
    header.drawImage(customerData.ytLogo, 574 - customerData.phoneOffsetX, 192, 12, 12);
    customerData.phoneOffsetX -= 24
    console.log(customerData.phoneOffsetX);
  }
  if(customerData.instaCheck != "0"){
    header.beginPath();
    header.arc(580 - customerData.phoneOffsetX, 198, 9, 0, 2 * Math.PI);
    header.fill();
    header.drawImage(customerData.igmLogo, 574 - customerData.phoneOffsetX, 192, 12, 12);
    customerData.phoneOffsetX -= 24
    console.log(customerData.phoneOffsetX);
  }
  if(customerData.googleCheck != "0"){
    header.beginPath();
    header.arc(580 - customerData.phoneOffsetX, 198, 9, 0, 2 * Math.PI);
    header.fill();
    header.drawImage(customerData.gglLogo, 574 - customerData.phoneOffsetX, 192, 12, 12);
    customerData.phoneOffsetX -= 24
    console.log(customerData.phoneOffsetX);
  }
  if(customerData.pinCheck != "0"){
    header.beginPath();
    header.arc(580 - customerData.phoneOffsetX, 198, 9, 0, 2 * Math.PI);
    header.fill();
    header.drawImage(customerData.pinLogo, 574 - customerData.phoneOffsetX, 192, 12, 12);
    customerData.phoneOffsetX -= 24
    console.log(customerData.phoneOffsetX);
  }
}