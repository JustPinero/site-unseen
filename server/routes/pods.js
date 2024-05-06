var express = require('express');
var router = express.Router();
const db = require("../db");

/* GET all pods  */
router.get('/', async(req,res)=>{
	try {
		const allPods = await db.query(
		`SELECT * FROM pods`
	);
	console.log(allPods.rows)
	res.json(allPods.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* GET all available pods */
router.get('/available', async(req,res)=>{
	try {
		const allAvailablePods = await db.query(
		`SELECT * FROM pods WHERE occupied = $1`,[false]
		);
		const data = allAvailablePods.rows;
		console.log(data);
		res.json(data);
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});


/* GET POD BY ID */
router.get('/:id', async(req,res)=>{
	try {
    const {id} = req.params
		const pod = await db.query(
		`SELECT * FROM pods where id=$1`,[id]
	);
	const data = pod.rows;
	console.log(data);
	res.json(data);
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* ADD POD */
router.post('/', async(req, res)=>{
	try {
		console.log("GENERATING POD")
		await db.query(
		`insert into pods (occupied, occupant_id) VALUES ($1, $2 )`,[false, null]
	);
	res.status(200);
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* UPDATE POD BY ID */
router.put('/:id', async(req,res)=>{
	try {
		const {id} = req.params
		const {status, occupant_id} =req.body;
		await db.query(
		`UPDATE pods SET occupied=$1, occupant_id=$2 WHERE id=$3`, [occupied, occupant_id, id]
	);
	res.status(200);
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* DELETE pod by id */
router.delete('/:id', async(req,res)=>{
	try {
		const {id} = req.params
		const deletePod = await db.query(
		`DELETE FROM pods WHERE id = $1`,[id]
	);
	res.status(200);
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* DELETE selected number of pods */
router.delete('/remove/:podcount', async(req,res)=>{
	try {
		const {podcount} = req.params
		await db.query(
		`DELETE from pods order by id desc limit $1`, [podcount]
	);
	res.status(200);
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

module.exports = router;