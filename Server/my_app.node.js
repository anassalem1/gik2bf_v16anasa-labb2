const My_port = 5000 ;
const http = require("http"); // import nodjs for handling http request , (external package)
const server = http.createServer((req,res) => { // create server method for listens for calls and callback functions , req  http request , res http response
    console.log(http.methods);   // as get , post , put , patch and delete
    const status = 500 ;
    res.writeHead(status); // for runing differnt parts as status , used for response obj 
    res.end("request called ${req.method} to ${req.url}"); // for finshing the request to send end to finsh
});

server.listen(My_port, () =>  console.log("Server runing on http://localhost:5000") ); // callback function that runs when the server has successfully started 