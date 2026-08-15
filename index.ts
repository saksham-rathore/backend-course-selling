import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();
const port = 3000;

app.use("/signUp", userRouter)
app.use("/course/preview", courses)


app.listen(port, () => {
    console.log(`your app is listening on port ${port}`);
});