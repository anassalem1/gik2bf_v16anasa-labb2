class API {
    url='';
    constructor(url) {
        this.url = url;
      }
      create(data) { // post 
        const JSONData = JSON.stringify(data);
        console.log("Sending ${JSONData} to ${this.url}");
    
        const request = new Request(this.url, {
          method: 'POST',
          body: JSONData,
          headers: {
            'content-type': 'application/json'
          }
        });
        return fetch(request).then( (result) => result.json()).then((data) => data).catch((error) => console.log(error));
        }
        
     get_all(){ // get
        return fetch(this.url).then( (result) => result.json()).then((data) => data).catch((error) => console.log(error));
     }

     remove(id){ // delete
        console.log("Removing task with id ${id}");
        return fetch("${this.url}/${id}" , {
            method: 'delete'
        }).then((result) => result).catch((error) => console.log(error));
     }

     update(id,data){ // patch , for udating 
        const JSONData = JSON.stringify(data);
        return fetch("${this.url}/${id}" , {
            method: 'patch',
            body: JSONData ,
            headers:{
                "content":"application/json"
            },
        }).then((result) => result).catch((error) => console.log(error));
     }
}