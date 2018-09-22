const http = require('http');
var date= require('date-and-time');
var request = require('request');
const async = require('async');

let arr =[];
for (i = 11; i <=20; i++){
    arr[i] = 'user'+i;
}

    var asyncTasks = [];
    arr.forEach(async (user) =>{
        console.log('Push to async queue --> requesting registeration for : '+user);
        await asyncTasks.push(function(){
            let pos= this.i;
            request.post(
                { url:'http://localhost:3500/api/auth/register', 
                    form: {
                        name: user,
                        email: user+'@xyz.com',
                        password: user
                    }
                }, 
                function(err,httpResponse,body){ 
                    if(err) console.log(err);
                    console.log(date.format(new Date(), 'YYYY/MM/DD HH:mm:ss:SSS') +' --> Response for '+JSON.parse(body).name);
                    console.log('\nBODY ->');    console.log(body);  console.log('/n/n');
                 }
            );
            })
        });

    async.parallel(asyncTasks, (done) => {
        console.log('\n\n');
        console.log(done);
    });
