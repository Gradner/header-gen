function generateHeader(){
  event.preventDefault();
  var inputs = $('#headerGen :input');
  var customerData = $.map(inputs, function(n, i){
    var o = {};
    o[n.name] = $(n).val();
    return o;
  });
  console.log(customerData);                      
}