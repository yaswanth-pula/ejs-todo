require('dotenv').config();
module.exports.getDbConnection=(db_name)=>{
    const dbConnection = process.env.DB_SERVER+process.env.DB_USER+":"+process.env.DB_PASS+process.env.DB_CLUSTER+db_name+process.env.DB_PARAMS;
    return dbConnection;
}
// console.log(this.getDbConnection("TEST"));