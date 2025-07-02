const express = require('express');

const app = express();

app.get('/', (req,res) => {
	res.send('<h1>Test of Node App.</h1>')
});

app.listen(3000, () => {console.log("Listening on 3000...")});
