import cron from "node-cron";

const cronJob = () => {
    cron.schedule("* * * * *", () => {  
        console.log("Cron job running");
    });
}

export default cronJob;