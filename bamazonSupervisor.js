var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "testpass",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
    display();
    
});

function display() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw (err);
        console.log(res);
        console.log("\n")
        questions();
        });
        
}

function questions() {
    

    inquirer
      .prompt([
        {
            name: "item_id",
            type: "input",
            message: "Enter the ID of the product you would like to buy"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units would you like to buy?"
        }
    ])

      .then(function(answer) {
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { item_id: answer.item_id }, function(err, res) {
            if (answer.quantity <= res[0].stock_quantity) {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                    {
                        stock_quantity: res[0].stock_quantity - answer.quantity
                    },
                    {
                        item_id: answer.item_id
                    },
                    
                    ],
                    function(err, result) {
                        update();
                        
                    });
                    
                }
        
            else {
                console.log('insufficient quantity!');
                connection.end();
            }

            function update() {
                var query = "SELECT * FROM products WHERE ?";
                connection.query(query, { item_id: answer.item_id }, function(err, res) {
                    console.log("updated quantity: " + res[0].stock_quantity);
                    console.log("\ntotal price: " + (res[0].price * answer.quantity));
                    connection.end();
            });
            
        }
      });
  });
}


  
