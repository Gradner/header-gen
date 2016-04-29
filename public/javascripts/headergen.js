//initalize canvas and customerdata object

var customerData = {};
var canvas = document.getElementById('header');
var header = canvas.getContext("2d");

//initialize images and assign those that are pre-set rather than customer selected

backgroundImage = new Image();
customerData.headShot = new Image();
customerData.companyLogo = new Image();
customerData.fbLogo = new Image();
customerData.fbLogo.src = 'social_fb_white.svg';
customerData.twLogo = new Image();
customerData.twLogo.src = 'social_tw_white.svg';
customerData.liLogo = new Image();
customerData.liLogo.src = 'social_in_white.svg';
customerData.ytLogo = new Image();
customerData.ytLogo.src = 'social_yt_white.svg';

// Main Header Generator function that is called when the form is submitted.
// Serializes the customer input and populates the customer data object, handles x axis // offsets added for social media buttons and then fires the script that populates the
// canvas element.

function generateHeader(){
  event.preventDefault();
  $("#headerGen").find(":input").each(function(){
    customerData[this.name] = $(this).val();
  });
  customerData.phoneOffsetX = 0;
  if(customerData.fbAddr != ""){
    customerData.phoneOffsetX += 24;
  }
  if(customerData.twitterAddr != ""){
    customerData.phoneOffsetX += 24;
  }
  if(customerData.liAddr != ""){
    customerData.phoneOffsetX += 24;
  }
  if(customerData.ytAddr != ""){
    customerData.phoneOffsetX += 24;
  }
  console.log(customerData);
  populateCanvas();
};

// Set of event handlers that watch for the customer to select a photo from their
// computer. Since we don't want to upload the images to a server, just use them to
// draw on the canvas element, we need to generate a URL that our canvas can use to
// find the image.

var loadHeadshot = function(event){
  var headshotPreview = document.getElementById('headshotPreview');
  headshotPreview.src = URL.createObjectURL(event.target.files[0]);
  customerData.headShot.src = headshotPreview.src;
}

var loadLogo = function(event){
  var logoPreview = document.getElementById('logoPreview');
  logoPreview.src = URL.createObjectURL(event.target.files[0]);
  customerData.companyLogo.src = logoPreview.src;
}

// The following 2 functions activate the "DDSlick" dropdown plugin on the page.
// This is a great jquery plugin for dropdown menus with graphics!
//
// More info available at http://designwithpc.com/Plugins/ddSlick

$("#bgDrop").ddslick({
  data:backgrounds,
  width:300,
  height:300,
  selectText:"Select a Background Image",
  imagePosition:"left",
  onSelected: function(selectedData){
    customerData.bgImg = selectedData.selectedData;
    backgroundImage.src = customerData.bgImg.fullUrl;
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

// The following two functions take the max width and max height of an image that is
// uploaded and generate a ratio to use when sizing the image on the canvas.
//
// They compare the uploaded images to a preset maxwidth and maxheight, generate a
// ratio for both the width and height and then select the smaller of the two.
//
// We select the smaller of the two, because we need to ensure that the image is
// constained to both of our proportions.
//
// Yes, I know that I could have used one function. No, I don't feel like refactoring
// them considering the project is, unto itself, a bit of a singleton.

function scalePhoto(){
  var ratio = 1;
  var ratio1 = 1;
  var ratio2 = 1;
  var maxWidth = 150;
  var maxHeight = 200;
  if(customerData.headShot.width > maxWidth)
    ratio1 = maxWidth / customerData.headShot.width;
  if(customerData.headShot.height > maxHeight)
    ratio2 = maxHeight / customerData.headShot.height;
  if(ratio1 >= ratio2){
    ratio = ratio2;
  } else {
    ratio = ratio1;
  }
  return ratio;
}

function scaleLogo(){
  var ratio = 1;
  var ratio1 = 1;
  var ratio2 = 1;
  var maxWidth = 200;
  var maxHeight = 150;
  if(customerData.companyLogo.width > maxWidth)
    ratio1 = maxWidth / customerData.companyLogo.width;
  if(customerData.companyLogo.height > maxHeight)
    ratio2 = maxHeight / customerData.companyLogo.height;
  if(ratio1 >= ratio2){
    ratio = ratio2;
  } else {
    ratio = ratio1;
  }
  return ratio;
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
  header.drawImage(backgroundImage,0,-35,580,240);
  header.fillStyle = customerData.clrScheme.color1;
  header.fillRect(0,178,580,200);
  header.fillStyle = customerData.clrScheme.color2;
  header.fillRect(0,182,580,200);
  header.fillStyle = "#ffffff"
  header.fillRect(0,213,580,200);
  header.font="26px LatoWebBold";
  header.fillStyle = customerData.clrScheme.color2;
  header.fillText(customerData.firstName + " " + customerData.lastName, 32, 266);
  header.font="14px LatoWeb";
  header.fillStyle = customerData.clrScheme.color2;
  header.fillText(customerData.jobTitle, 32, 286);
  header.font="italic 20px LatoWebSemibold";
  header.fillStyle = customerData.clrScheme.color1;
  header.fillText(customerData.personalSlogan, 32, 308);
  header.font="20px LatoWebSemibold";
  header.fillStyle = customerData.clrScheme.color2;
  header.fillText(customerData.webAddr, 32, 338);
  header.font="20px LatoWebSemibold";
  header.fillStyle = "#ffffff";
  header.fillText(customerData.phoneNumber, 425 - (customerData.phoneOffsetX + ((customerData.phoneNumber.length - 14) * 10)), 205);
  header.fillStyle = customerData.clrScheme.color1;
  if(customerData.fbAddr != ""){
    header.beginPath();
    header.arc(580 - customerData.phoneOffsetX, 198, 9, 0, 2 * Math.PI);
    header.fill();
    header.drawImage(customerData.fbLogo, 576 - customerData.phoneOffsetX, 192, 8, 12);
    customerData.phoneOffsetX -= 24
  }
  if(customerData.twitterAddr != ""){
    header.beginPath();
    header.arc(580 - customerData.phoneOffsetX, 198, 9, 0, 2 * Math.PI);
    header.fill();
    header.drawImage(customerData.twLogo, 574 - customerData.phoneOffsetX, 192, 12, 12);
    customerData.phoneOffsetX -= 24
  }
  if(customerData.liAddr != ""){
    header.beginPath();
    header.arc(580 - customerData.phoneOffsetX, 198, 9, 0, 2 * Math.PI);
    header.fill();
    header.drawImage(customerData.liLogo, 574 - customerData.phoneOffsetX, 192, 12, 12);
    customerData.phoneOffsetX -= 24
  }
  if(customerData.ytAddr != ""){
    header.beginPath();
    header.arc(580 - customerData.phoneOffsetX, 198, 9, 0, 2 * Math.PI);
    header.fill();
    header.drawImage(customerData.ytLogo, 574 - customerData.phoneOffsetX, 192, 12, 12);
    customerData.phoneOffsetX -= 24
  }
  var logoRatio = scaleLogo();
  header.drawImage(customerData.companyLogo, 570 - (customerData.companyLogo.width * logoRatio), 215 + ((170 - (customerData.companyLogo.height * logoRatio)) / 2), (customerData.companyLogo.width * logoRatio), (customerData.companyLogo.height * logoRatio));
  header.shadowColor = "#404040"
  header.shadowBlur = 2;
  header.shadowOffsetX = 2;
  header.shadowOffsetY = 2;
  var headshotRatio = scalePhoto();
  header.drawImage(customerData.headShot, 32, 235 - (customerData.headShot.height * headshotRatio), (customerData.headShot.width * headshotRatio), (customerData.headShot.height * headshotRatio));
  header.shadowColor = "#fff"
  header.shadowBlur = 0;
  header.shadowOffsetX = 0;
  header.shadowOffsetY = 0;
};