/**
 *  A Simple Date Module for the Root Route List
 */
module.exports.getDay = ()=>{ 	
    const date = new Date();
    const  options = {weekday:'long'};
    return  date.toLocaleDateString("en-US",options);
}