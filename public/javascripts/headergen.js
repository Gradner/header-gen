function generateHeader(){
  event.preventDefault();
  var customerData = {};
  $("#headerGen").find(":input").each(function(){
    customerData[this.name] = $(this).val();
  });
  console.log(customerData);
}