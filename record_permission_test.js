

function handle(success, data){

  setTimeout(function(){
    queue.discard();
    queue.unsubscribe()
    client.close();
    console.log("close!");
  }, 15000)

  client.on('error', function( error, event, topic ){
    console.log("Error evt:" + error, event, topic);
  })

  client.on( 'connectionStateChanged', function( connectionState ){
    console.log("State:" + connectionState);
  });


  if (success) {

    // start application
    // client.getConnectionState() will now return 'OPEN'
    //client.event.subscribe('/health-check', function(data){
    //  console.log('error: ' + data);
    //})

    var queue = client.record.getRecord("app.catcher/queue/1234");

    queue.whenReady(function(){

      var old = queue.get();
      console.log("Record got, Value before set:" + old);

      console.log("Try subscribing....");

      queue.subscribe(function(data){
      	console.log("Queue change: " + data);
      })


      queue.set(['a','app.catch', Math.random()], function(err){
        if (err) {
          console.log('Record 1st set Error:', err)
        } else {
          console.log('Record 1st set OK')
        }
        console.log("After set:" + queue.get());
      });


      setTimeout(function(){
	      var old = queue.get();
	      console.log("Record got, Value before 2nd set:" + old);

	      queue.set(['a','app.catcher', Math.random()], function(err){
	        if (err) {
	          console.log('Record 2nd set Error:', err)
	        } else {
	          console.log('Record 2nd set OK')
	        }
	        console.log("After set:" + queue.get());
	      })
      }, 5000);

      setTimeout(function(){
	      var old = queue.get();
	      console.log("Record got, Value before 3rd set:" + old);

	      queue.set(['a','app.catcher', Math.random()], function(err){
	        if (err) {
	          console.log('Record 3rd set Error:', err)
	        } else {
	          console.log('Record 3rd set OK')
	        }
	        console.log("After set:" + queue.get());
	      })
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

