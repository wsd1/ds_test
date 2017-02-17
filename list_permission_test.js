

function handle(success, data){

  if (success) {
    console.log("Login success!!!!");

    setTimeout(function(){
      console.log("close!");
      queue.discard();
      //queue.unsubscribe()
      client.close();
    }, 15000)

    client.on('error', function( error, event, topic ){
      console.log("[Error evt]:" + error, event, topic);
    })

    client.on( 'connectionStateChanged', function( connectionState ){
      console.log("[State evt]:" + connectionState);
    });

    // start application
    // client.getConnectionState() will now return 'OPEN'
    //client.event.subscribe('/health-check', function(data){
    //  console.log('error: ' + data);
    //})

    var queue = client.record.getList("app.catcher/queue/1235");


    queue.whenReady(function(){

      var old = queue.getEntries();
      console.log("list got, Value before set entry:" + old);

//      console.log("Try subscribing....");
//      queue.subscribe(function(data){
//        console.log("Queue change: " + data);
//      })

      queue.setEntries(['a','app.catch'], function(err){
        if (err) {
          console.log('List 1st set Error:', err)
        } else {
          console.log('List 1st set OK')
        }
        console.log("After set:" + queue.get());
      });


      setTimeout(function(){

        var old = queue.getEntries();
        console.log("List got, Value before remove entry:" + old);

        queue.removeEntry('app.catch')

      }, 5000);


      setTimeout(function(){

        var old = queue.getEntries();
        console.log("Record got, Value before add entry:" + old);

        queue.addEntry('app.catcher')

      }, 10000);



    });

/*
const beatlesAlbums = client.record.getList('albums')
beatlesAlbums.whenReady(() => {
  console.log(beatlesAlbums.getEntries())
})
*/

  } else {
    // extra data can be optionaly sent from deepstream for
    // both successful and unsuccesful logins
    alert(data)

    // client.getConnectionState() will now return
    // 'AWAITING_AUTHENTICATION' or 'CLOSED'
    // if the maximum number of authentication
    // attempts has been exceeded.
  }
}

