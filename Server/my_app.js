const exp = require("exp"); // declaring and intilazing 
const app = exp();
const prom_fs = require ("prom_fs/promise"); // using const bec data coming from the server 
const My_port = 5000 ;

app.use(exp.json()).use(exp.urlencoded({extend:false})).use((req,res,next) => { // reading jason 
    res.header("Access-control-allow-origin","*");
    res.header("Access-control-allow-headers","*");
    res.header("Access-control-allow-methods","*");
    next();
});

app.get("/tasks", async (req,res) =>{ // getting taks
    try{
        const tasks = await prom_fs.readFile("./tasks.json");
        res.send(JSON.parse(tasks));
    }
    catch (error){ // for catching error 
        res.status(500).send({ error });
    }
});

app.post("/tasks", async (req,res) =>{ // for posting 
    try{
        const tasks = req.body;
        const listBuffer = await prom_fs.readFile("./tasks.json");
        const current_T = JSON.parse(listBuffer);
        let max_Task_Id = 1 ;

        if(current_T && current_T.length > 0 ){
            max_Task_Id = current_T.reduce(
                (max_Id,Curent_element) => Curent_element.id > max_Id  ? Curent_element.id : max_Id , max_Task_Id
            );
        }
        
        const NewTask = {id: max_Task_Id + 1 , ...tasks};
        const NewList = current_T ? [...current_T,NewTask] : [NewTask];

        await prom_fs.writeFile("./tasks.json", JSON.stringify(NewList));
        res.send(NewTask);
    }
    catch(error){ // for catching error 
        res.status(500).send({ error: error.stack });
    }
    });

app.delete("/tasks", async (req,res) =>{  // for deleting 
    try{
        const id = req.params.id;
        const listBuffer = await prom_fs.readFile("./tasks.json"); // read 
        const current_T = JSON.parse(listBuffer);
        if(current_T && current_T.length > 0){
            await prom_fs.writeFile("./tasks.json", JSON.stringify(current_T.filter((tasks) => tasks.id != id ))); // not equal id 
            res.send({ message : 'Uppgift med id ${id} Was removed'});
        }
        else{
            res.status(404).send({error: "No Tasks deleted "}) // not removed 
        }
    } catch(error){ // for catching error 
        res.status(500).send({ error: error.stack });
    }
});

app.patch ("/tasks", async (req,res) =>{
    try{
        const id = req.params.id;
        const listBuffer = await prom_fs.readFile("./tasks.json"); // read 
        const current_T = JSON.parse(listBuffer);
        if(current_T && current_T.length > 0){
            const index = current_T.findIndex((tasks) => tasks.id == id );
            const update = {...current_T[index],...tasks};
            const List = [
                ...current_T.slice(0,index),
                update,
                ...current_T.slice( index + 1 ),
            ];
            await prom_fs.writeFile("./tasks.json", JSON.stringify(NewList));
            res.send(update);
        }
        else{
            res.status(404).send({error: "No Data to update "}) // not updated 
        }
    }
    catch (error) { // for catching error 
        res.status(500).send({ error: error.stack });
      }
});
app.listen(My_port, () => console.log("Server runing on http://localhost:5000")); // callback function that runs when the server has successfully started 