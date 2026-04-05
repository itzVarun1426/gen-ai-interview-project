import 'dotenv/config.js'
import app from './src/app.js';
import connectDB from './src/db/db.js';
// import {generateInterviewReport} from './src/services/ai.service.js';
// import {resume , selfDescription , jobDescription} from './temp.js';


connectDB();
// await generateInterviewReport({
//   resume,
//   selfDescription,
//   jobDescription
// });

app.listen(process.env.PORT,()=>{
    console.log("server running on port :",process.env.PORT)
})

