// import { CronJob } from 'cron';
// import { User } from '../db/models/User';
// import { MailerService } from './mailingService';
// import { management } from '../db/models/Management';

// export class CronManager {
//     static async runJob(manageForms) {        
//         const task = new CronJob('* * * * * *', () => {
//             console.log("Task running " + new Date(Date.now()));
//             manageForms.forEach(form  => {
//                 MailerService.getEmail(form.user);
//             })
//         })
//         task.start();
//     }
// }