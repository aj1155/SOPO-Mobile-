$(function() {
  console.log('jqueary실행');
  $('#btn1').click(function(){
    console.log('이벤트 실행!');
    $('#pbody').append('<li>' + '하하하' + '</li>');
    $('#pbody').append('<li>' + $('#txt').text() + '<br/></li>');
  });


});
