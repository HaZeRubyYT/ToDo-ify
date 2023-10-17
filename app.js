import express from "express";
import ejs from "ejs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "node:fs";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
let sharedData = { Text: "" };
let textData = { title: "", link: "" };
let listType = "";
let todoJSON = "";
app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("home.ejs");
});

app.post("/process1", (req, res) => {
	sharedData.Text = req.body.buttonText;
	// console.log(buttonText + '  1');
	res.redirect("/todo");
});

app.post("/process2", (req, res) => {
	sharedData.Text = req.body.anchorText;
	// console.log(sharedData.Text + "  1");
	res.redirect("/todo");
});

app.post("/append", async (req, res) => {
	// Read the JSON file
	// console.log(listType);
	// console.log(new_todo);
	fs.readFile(`${__dirname}/data.json`, "utf8", (err, data) => {
		if (err) {
			console.error("Error reading the JSON file:", err);
			return;
		}

		// Parse the JSON data into a JavaScript array
		let jsonData = JSON.parse(data);
		// console.log(jsonData);
		console.log(req.body);
		let todoDetail = {
			todo: req.body.todo,
			list: req.body.list,
		};
		let ting = todoDetail.todo;
		// Append the new string to the array
		if (ting.length !== 0 && ting !== null) {
			jsonData.todo.push(todoDetail);
			let updatedJSON = JSON.stringify(jsonData);

			// Write the updated JSON data back to the file
			fs.writeFile(`${__dirname}/data.json`, updatedJSON, "utf8", (err) => {
				if (err) {
					console.error("Error appending data to the JSON file:", err);
					return;
				}

				console.log("Data appended to the JSON file.");
			});
		}
		// res.redirect("/refresh");
		console.log("ooongaaa bonnnga !!!ijwsdi9fj aiopsdjfiopas djfoadsj");
	});

	res.json(req.body.todo);
});

app.get("/refresh", (req, res) => {
	console.log("Im GAYYYYYYYYYYYY");
	res.redirect("/todo");
});
app.get("/todo", (req, res) => {
	textData.title = sharedData.Text;
	if (textData.title === "Work") {
		textData.link = "Personal";
	} else if (textData.title === "Personal") {
		textData.link = "Work";
	}
	// console.log(textData.title);
	listType = textData.title;

	let data = fs.readFileSync(`${__dirname}/data.json`, "utf8", (err) => {
		if (err) {
			console.error("Error reading the JSON file:", err);
			return;
		}
	});
	// console.log(data);
	// console.log(JSON.parse(data).todo);
	todoJSON = JSON.parse(data).todo;
	// console.log(todoJSON);

	res.render("todo.ejs", {
		title: textData.title,
		link: textData.link,
		json: todoJSON,
	});
});

app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
