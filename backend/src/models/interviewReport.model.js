import mongoose from 'mongoose';

/**
 * 
 * -job description schema:string 
 * -resume text :string
 * -self description:string 
 * 
 * match-score :number
 * 
 * Technical questions :
 *      [
 *          {
 *              question :""
 *              intention :""
 *              answer : ""
 *          }
 *      ]
 * Behavioral question :
 *      [
 *          {
 *              question :""
 *              intention :""
 *              answer : ""
 *          }
 *      ]
 * Skills gaps :
 *      [
 *          {
 *              skill : ""
 *              severity :{
 *                          string :
 *                          enum :["low ", "medium ", "high"]
 *                         }
 *          }
 *      ]
 * Preration plan :
 *      [
 *          {
 *              day:number,
 *              focoused_topic:string,
 *              task:[string]
 *          }
 *      ]
 * 
 * 
 */

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true, 'question is required']
    },
    intention:{
        type:String,
        required:[true, 'intention is required']
    },
    answer:{
        type:String,
        required:[true, 'answer is required']
    }
},{
    _id:false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,'question is required']
    },
    intention:{
        type:String,
        required:[true,'intention is required']
    },
    answer:{
        type:String,
        required:[true,'answer is required']
    }
},{
    _id:false
})

const skiilsGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true,'skill is required']
        },
    severity:{
        type:String,
        required:[true,'severity is required'],
        enum:["low","medium","high"]
    }
},{
    _id:false
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,'day is required']
        },
    focused_topic:{
        type:String,
        required:[true,'focoused_topic is required']
        },
    task:{
        type:[String],
        required:[true,'task is required']
    }
},{
    _id:false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, 'Job description is required'],
    },
    resume:{
        type:String
    },
    selfDescription:{
        type:String
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillsGaps:[skiilsGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'user is required']
    }
},{
    timestamps:true 
})

const interviewReportModel = mongoose.model('InterviewReport', interviewReportSchema)
export default interviewReportModel;
