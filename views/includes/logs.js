const socket = io();

socket.on("logs", log => {
  console.log(log);
  $("#logs").val(log);
});
