import express, { Request, Response, NextFunction } from "express";

const app = express();

//database
const Projects: Iproject[] = [];

app.use(express.json());
//Interface
interface Iproject {
  id: number;
  title: string;
  tasks: string[];
}

//Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Get request from url ${req.url} with method ${req.method}`);

  next();
});

const checkingBodyData = (req: Request, res: Response, next: NextFunction) => {
  const data: Iproject = req.body;
  if (!data.title) {
    return res.status(400).json({ erro: "Incomplete data" });
  }

  next();
};

const checkingIdProject = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (!Projects[id]) {
    return res.status(400).json({ erro: "This user not exist!" });
  }

  next();
};

//Routes

app.get("/projects", (req, res) => {
  return res.json(Projects);
});

app.get("/projects/:id", checkingIdProject, (req, res) => {
  const id = Number(req.params.id);

  const data = Projects[id];

  return res.json(data);
});

app.post("/projects", checkingBodyData, (req, res) => {
  const RequestData: Iproject = req.body;

  const id = Projects.length;
  const data = { ...RequestData, id };

  Projects.push(data);

  return res.json({ state: "Success for request!" });
});

app.put("/projects/:id", checkingIdProject, checkingBodyData, (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  const data = { id, ...body };
  Projects[id] = data;

  return res.json({ state: "Success for edit request!" });
});

app.delete("/projects/:id", checkingIdProject, (req, res) => {
  const id = Number(req.params.id);

  Projects.splice(id, 1);

  return res.json({ state: "Success for delete request!" });
});

app.listen(3333);
