/*
  REST API/CRUD HTTP Verb and Status Codes
  CRUD    Verb    Entire Collection   Single Item
  ------------------------------------------------------------------------
  Default for bad URLs                404 (Not Found - Bad URL)
  Default for errors                  400 (Bad Request)
  Create  POST    405 (Not Allowed)   201 (Created)
                                      409 (Conflict - already exists)
  Read    GET     200 (OK)            200 (OK - content found)
                                      204 (No Content - can't find content)
  Update  PUT     405 (Not Allowed)   204 (OK - content updated)
                                      204 (No Content - can't find content)
  Delete  DELETE  405 (Not Allowed)   200 (OK - content deleted)
                                      204 (No Content - can't find content)
*/

// #region  **** Libraries ****
// Require filesystem library
const fs = require("fs");

// Require mysql connection library
const mysql = require("mysql2");

// Require the Fastify framework and instantiate it
const fastify = require("fastify")();
// #endregion

// #region  **** Connection information ****
// Include server access information
//const dbInfo = require("./dbInfo.js");
// #endregion

// #region **** Use non-object or object version of SQL parameterization ****
// Toggle between using object method for queries
const ObjectQueriesToggle = false;
// #endregion

// #region  **** Console output settings ****
// Debug toggle: output debug statements to console
const DO_DEBUG = true;

// Status toggle: output status messages to console
const DO_STATUS = true;
// #endregion

// Handle request for JS file

// #region  **** Read/GET (CRUD/HTTP verb) ****
// Read/GET: Get pathways
fastify.get("/pathways/:PathwayID?", (request, reply) => {
  // Extract PathwayID from request object using deconstruction
  const { PathwayID = "" } = request.params;
  if (DO_DEBUG) console.log("Route /pathways GET", PathwayID);

  // Initialize data object for query
  let data = [];

  // Define initial query (embedded query)
  let sql = "SELECT * FROM pathways";

  // Construct query using ? as replacement parameters replaced from data
  if (PathwayID.length > 0) {
    if (!ObjectQueriesToggle) {
      // Non-object technique
      sql += " WHERE PathwayID = ?";
      data.push(PathwayID);
    } else {
      // Object technique, only works if request parameter(s) match database column names
      sql += " WHERE ?";
      data = request.params;
    }
    if (DO_DEBUG) console.log(data);
  } else {
    sql += " ORDER BY PathwayName";
  }
  if (DO_DEBUG) console.log("SQL", sql);

  // Setup default response object
  const response = {
    error: "",
    statusCode: 200,
    rows: [],
  };

  // Execute query and respond
  connection.query(sql, data, (errQuery, rows) => {
    if (errQuery) {
      if (DO_STATUS) console.log(errQuery);
      response.error = errQuery;
      response.statusCode = 400;
    } else if (rows.length > 0) {
      if (DO_STATUS) console.log("Rows returned", rows.length);
      response.rows = rows;
    } else {
      if (DO_STATUS) console.log("No pathway rows...\n");
      response.statusCode = 204;
    }

    // Webserver response
    reply
      .code(response.statusCode)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response)
      .send(response);
  });
});
// #endregion


// #region  **** Read/GET (CRUD/HTTP verb) ****
// Read/GET: Get pathways
fastify.get("/RegistrationResults", (request, reply) => {
  // Extract PathwayID from request object using deconstruction
  const { RegisterID = "" } = request.params;
  if (DO_DEBUG) console.log("Route /vw_register_results GET", RegisterID);

  // Initialize data object for query
  let data = [];

  // Define initial query (embedded query)
  let sql = "SELECT * FROM vw_register_results";

  // Construct query using ? as replacement parameters replaced from data
  if (RegisterID.length > 0) {
    if (!ObjectQueriesToggle) {
      // Non-object technique
      sql += " WHERE RegisterID = ?";
      data.push(RegisterID);
    } else {
      // Object technique, only works if request parameter(s) match database column names
      sql += " WHERE ?";
      data = request.params;
    }
    if (DO_DEBUG) console.log(data);
  } else {
    sql += " ORDER BY Member_Name";
  }
  if (DO_DEBUG) console.log("SQL", sql);

  // Setup default response object
  const response = {
    error: "",
    statusCode: 200,
    rows: [],
  };

  // Execute query and respond
  connection.query(sql, data, (errQuery, rows) => {
    if (errQuery) {
      if (DO_STATUS) console.log(errQuery);
      response.error = errQuery;
      response.statusCode = 400;
    } else if (rows.length > 0) {
      if (DO_STATUS) console.log("Rows returned", rows.length);
      response.rows = rows;
    } else {
      if (DO_STATUS) console.log("No registered rows...\n");
      response.statusCode = 204;
    }

    // Webserver response
    reply
      .code(response.statusCode)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response)
      .send(response);
  });
});
// #endregion


// #region **** Create/POST (CRUD/HTTP verb) ****
// Create/POST: Add pathways
// Note: The trailing / (e.g. /pathways/) is required to make POST work
fastify.post("/pathways/", (request, reply) => {

  const { PathwayID: PathwayID, PathwayName: PathwayName } = request.body;
  if (DO_DEBUG) console.log("Route /pathways POST", PathwayID, PathwayName);

  // Define initial query (embedded query), and data object
  let sql = "INSERT INTO pathways (PathwayID, PathwayName ) VALUES (?, ?)";
  let data = [PathwayID, PathwayName];
  if (ObjectQueriesToggle) {
    sql = "INSERT INTO pathways SET ?";
    data = { PathwayID, PathwayName };
  }

  // Setup default response object
  const response = {
    error: "",
    statusCode: 201,
    id: "",
  };

  // Execute query and respond
  connection.query(sql, data, (errQuery, result) => {
    if (errQuery) {
      if (DO_STATUS) console.log(errQuery);
      response.error = errQuery;
      response.statusCode = 400;
    } else {
      if (DO_STATUS) console.log("Insert ID: ", result.insertId);
      response.id = result.insertId;
    }

    // Webserver response
    reply
      .code(response.statusCode)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response);
  });
});
// #endregion

// #region **** Delete/DELETE (CRUD/HTTP verb) ****
// Delete/DELETE: Delete pathway
fastify.delete("/pathways/:PathwayID?", (request, reply) => {
  // Extract PathwayID from request object using deconstruction
  const { PathwayID = "" } = request.params;
  if (DO_DEBUG) console.log("Route /pathways DELETE", PathwayID);

  // Define initial query (embedded query), and data object
  let sql = "DELETE FROM pathways WHERE PathwayID = ?";
  let data = [PathwayID];
  if (ObjectQueriesToggle) {
    sql = "DELETE FROM pathways WHERE ?";
    data = { PathwayID };
  }

  // Setup default response object
  const response = {
    error: "",
    statusCode: 201,
    id: "",
  };

  // Execute query and respond
  if (PathwayID.length > 0) {
    // Delete single item
    connection.query(sql, data, (errQuery, result) => {
      if (errQuery) {
        if (DO_STATUS) console.log(errQuery);
        response.error = errQuery;
        response.statusCode = 400;
      } else {
        const { affectedRows = 0 } = result;
        if (affectedRows > 0) {
          if (DO_STATUS) console.log("Delete ID: ", PathwayID);
          response.id = PathwayID;
        } else {
          if (DO_STATUS) console.log("Unknown ID: ", PathwayID);
          response.statusCode = 404;
        }
      }
      if (DO_DEBUG) console.log(result);

      // Webserver response
      reply
        .code(response.statusCode)
        .header("Content-Type", "application/json; charset=utf-8")
        .send(response);
    });
  } else {
    // Attempt to delete collection not supported
    // Webserver response
    response.statusCode = 405;
    response.error = "Delete entire collection not allowed";
    reply
      .code(response.statusCode)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response);
  }
});
// #endregion


// #region **** Delete/DELETE (CRUD/HTTP verb) ****
// Delete/DELETE: Delete pathway with stored procedure
fastify.delete("/sp/:AlumID?", (request, reply) => {
  // Extract PathwayID from request object using deconstruction
  const { AlumID = "" } = request.params;
  if (DO_DEBUG) console.log("Route /sp_deleteRow DELETE", AlumID);

  // Define initial query (embedded query), and data object
  let sql = 'CALL sp_deleteRow(?)';
  let data = [AlumID];
  if (ObjectQueriesToggle) {
    sql = 'CALL sp_deleteRow(?)';
    data = { AlumID };
  }

  // Setup default response object
  const response = {
    error: "",
    statusCode: 201,
    id: "",
  };

  // Execute query and respond
  if (AlumID.length > 0) {
    // Delete single item
    connection.query(sql, data, (errQuery, result) => {
      if (errQuery) {
        if (DO_STATUS) console.log(errQuery);
        response.error = errQuery;
        response.statusCode = 400;
      } else {
        const { affectedRows = 0 } = result;
        if (affectedRows > 0) {
          if (DO_STATUS) console.log("Delete ID: ", AlumID);
          response.id = AlumID;
        } else {
          if (DO_STATUS) console.log("Unknown ID: ", AlumID);
          response.statusCode = 404;
        }
      }
      if (DO_DEBUG) console.log(result);

      // Webserver response
      reply
        .code(response.statusCode)
        .header("Content-Type", "application/json; charset=utf-8")
        .send(response);
    });
  } else {
    // Attempt to delete collection not supported
    // Webserver response
    response.statusCode = 405;
    response.error = "Delete entire collection not allowed";
    reply
      .code(response.statusCode)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response);
  }
});
// #endregion



// #region **** Update/PUT: Update pathway ****
fastify.put("/pathways/:PathwayID?", (request, reply) => {
  // Extract PathwayID from request object using deconstruction
  const { PathwayID = "" } = request.params;
  const { PathwayName: PathwayName } = request.body;
  if (DO_DEBUG) console.log("Route /pathways PUT", PathwayID, PathwayName);

  // Define initial query (embedded query), and data object
  let sql = "UPDATE pathways SET ";
  let setSQL = "";
  let data = [];
  if (!ObjectQueriesToggle) {
    if (PathwayName) {
      setSQL = "PathwayName = ?";
      data.push(PathwayName);
    }
    if (setSQL.length > 0 && PathwayID.length > 0) {
      setSQL += " WHERE PathwayID = ?";
      data.push(PathwayID);
    }
  } else {
    // Object version
    sql = "UPDATE pathways SET ? WHERE PathwayID=?";
    data = { PathwayID };
  }

  // Setup default response object
  const response = {
    error: "",
    statusCode: 201,
    id: "",
  };

  // Execute query and respond
  if (PathwayID.length > 0) {
    // Verify sql and data populated for update
    if (setSQL.length === 0 || data.length === 0) {
    // Webserver response
    response.statusCode = 400;
    response.error = "Data missing for update";
    reply
      .code(response.statusCode)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response);
    } else {
      // Delete single item
      sql += setSQL;
      connection.query(sql, data, (errQuery, result) => {
        if (errQuery) {
          if (DO_STATUS) console.log(errQuery);
          response.error = errQuery;
          response.statusCode = 400;
        } else {
          const { affectedRows = 0 } = result;
          if (affectedRows > 0) {
            if (DO_STATUS) console.log("Update ID: ", PathwayID);
            response.id = PathwayID;
          } else {
            if (DO_STATUS) console.log("Unknown ID: ", PathwayID);
            response.statusCode = 404;
          }
        }
        // if (DO_DEBUG) console.log(result);

        // Webserver response
        reply
          .code(response.statusCode)
          .header("Content-Type", "application/json; charset=utf-8")
          .send(response);
      });
    }
  } else {
    // Attempt to delete collection not supported
    // Webserver response
    response.statusCode = 405;
    response.error = "Delete entire collection not allowed";
    reply
      .code(response.statusCode)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(response);
  }
});
// #endregion

// #region **** Ummatched routes ****
// Unmatched route handler
function unmatchedRouteHandler(reply) {
  // Setup default response object
  const response = {
    error: "Unsupported request",
    statusCode: 404,
  };
  reply
    .code(response.statusCode)
    .header("Content-Type", "application/json; charset=utf-8")
    .send(response);
}

// Unmatched verbs
fastify.get("*", (_, reply) => {
  unmatchedRouteHandler(reply);
});
fastify.post("*", (_, reply) => {
  unmatchedRouteHandler(reply);
});
fastify.delete("*", (_, reply) => {
  unmatchedRouteHandler(reply);
});
fastify.put("*", (_, reply) => {
  unmatchedRouteHandler(reply);
});
// #endregion

/*

// Update/PUT: Update color
app.put('/colors', function (req, res) {
   console.log("Route /colors PUT");
   let data = [{PathwayName: req.body.color, COLOR_HEX: req.body.hex}, req.body.id];
   connection.query("UPDATE COLOR SET ? WHERE PathwayID=?",  
      data, 
      function (errQuery, result) {
         if (errQuery) {
            console.log(errQuery);
            res.json({status: "Error", err: errQuery});
         } else {
            console.log("Updated ID: ", req.body.id, ", Affected Rows: ", result.affectedRows);
            res.json({status: req.body.id, err: "", message: "Row updated"});         }
      }
   );
});
*/

// #region **** Create database connection ****
// Note: Output all of the DB connection statements
console.log("Creating connection...\n");
let connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "cit381",
  database: "alumni",
});
// Connect to database
connection.connect(function (err) {
  console.log("Connecting to database...\n");

  if (err) {
    // Handle any errors
    console.log(err);
    console.log("Exiting application...\n");
  } else {
    console.log("Connected to database...\n");
    // Start server and listen to requests using Fastify
    // Note: Latest version of fastify listen requires object as first parameter
    const host = "127.0.0.1";
    const port = 8080;
    fastify.listen({ host, port }, (err, address) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      console.log(`Server listening on ${address}`);
    });
  }
});
// #endregions
