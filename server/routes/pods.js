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

/* GET all pods by status */
router.get('/status/:status', async(req,res)=>{
	try {
    const {status} = req.params;
		const allPodsByStatus = await db.query(
		`SELECT * FROM pods WHERE status = $1`,[status]
	);
	console.log(allPodsByStatus.rows);
	res.json(allPodsByStatus);
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* GET pod by id */
router.get('/:id', async(req,res)=>{
	try {
    const {id} = req.params
		const pod = await db.query(
		`SELECT * FROM pods where id=$1`,[id]
	);
	console.log(pod.rows)
	res.json(pod.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* ADD POD */
router.post('/', async(req, res)=>{
	try {
		const newPod = await db.query(
		`insert into pods (status, occupant_id) VALUES ($1, $2 )`,["vacant", null]
	);
	console.log(newPod.rows)
	res.json(newPod.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});


/* UPDATE pod by id */
router.put('/:id', async(req,res)=>{
	try {
		const {id} = req.params
		const {status, occupant_id} =req.body;
		const updatePod = await db.query(
		`UPDATE pods SET status=$1, occupant_id=$2 WHERE id=$3`, [status, occupant_id, id]
	);
	console.log(updatePod.rows)
	res.json(updatePod.rows)
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
	console.log(deletePod.rows)
	res.json(deletePod.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

/* DELETE selected number of pods */
router.delete('/remove/:podcount', async(req,res)=>{
	try {
		const {podcount} = req.params
		const deletedPods = await db.query(
		`DELETE from pods order by id desc limit $1`, [podcount]
	);
	console.log(deletedPods.rows)
	res.json(deletedPods.rows)
	} catch (error) {
		console.log("ERROR:  ", error.message)
	}
});

module.exports = router;