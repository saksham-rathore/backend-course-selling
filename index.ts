import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();
const port = 3000;

app.post('/user/signup', (req: Request, res: Response) => {
    res.json({
        message: "signup endpoint"
    });
});


app.put('/user/signup', (req: Request, res: Response) => {
    res.json({
        message: "update"
    });
});


app.get('/user/purchases', (req: Request, res: Response) => {
    res.json({
        message: "get email"
    });
});


app.get('/courses', (req: Request, res: Response) => {
    res.json({
        message: "delete endpoints"
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});