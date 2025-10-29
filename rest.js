const http = require('http');
const url = require('url');

const menu = [
    { id: 1, item: "Burger", price: 299 },
    { id: 2, item: "Dosa", price: 50 },
    { id: 3, item: "Samosa", price: 5 }
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

  

    
    if (method === "GET" && path === "/getmenu") {
        res.writeHead(200);
        res.end(JSON.stringify(menu)); 
    }

    else if (method === "GET" && path.startsWith("/menu/")) {
        const id = parseInt(path.split('/')[2]);
        const item = menu.find((item) => item.id === id);

        if (item) {
            res.writeHead(200);
            res.end(JSON.stringify(item));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: "Item not found" }));
        }
    }
    else if(method==="POST" && path==="/menu")
    {
        let body="";
        req.on("data",(chunk)=>
        {
            body+=chunk.toString();

        });
        req.on("end",()=>
        {
            const newItem=JSON.parse(body);
            newItem.id=menu.length+1;
            menu.push(newItem);
            res.writeHead(201);
            res.end(JSON.stringify({message:"item added",Item:newItem}))
        });
    }
    
    else if (method === "DELETE" && path.startsWith("/menu/")) {
    const id = parseInt(path.split('/')[2]); 
    const index = menu.findIndex(m => m.id === id);

    if (index !== -1) {
        const deletedItem = menu.splice(index, 1); 
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Item deleted"}));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Item not found" }));
    }
}

   
   
});

server.listen(8000, () => console.log("Server running on port 8000"));